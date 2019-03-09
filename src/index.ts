import { readFileSync, writeFileSync, lstatSync } from 'fs'
import { resolve } from 'path'
import yaml from 'yaml'

type AllowedYamlTypes = string | number | boolean
type AllowedTypes = AllowedYamlTypes | AllowedYamlTypes[]

export default class Memento {
	private readonly file: string
	private state: any

	constructor(file: string) {
		this.file = resolve(file)
		try {
			this.read()
		} catch (e) {
			this.state = {}
			this.save()
		}
	}

	public get<AllowedTypes>(setting: string, defaultValue: AllowedTypes | undefined = undefined): AllowedTypes {
		const props = setting.split('.')
		let root = this.state
		try {
			for (const prop of props)
				root = root[prop]
		} catch (e) {
		}
		if (root) return root
		if (defaultValue) {
			// @ts-ignore
			this.set(setting, defaultValue)
			return defaultValue
		}
		throw new Error('Could not load the setting')
	}

	public set(setting: string, value: AllowedTypes): void {
		const props = setting.split('.')
		let root = this.state
		for (const prop of props.slice(0, -1)) {
			if (typeof root[prop] !== 'object') root[prop] = {}
			root = root[prop]
		}
		root[props[props.length - 1]] = value
		this.save()
	}

	private read() {
		this.state = yaml.parse(readFileSync(this.file, 'utf-8'))
	}

	private save() {
		writeFileSync(this.file, yaml.stringify(this.state), 'utf-8')
	}
}