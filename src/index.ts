import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import * as yaml from 'yaml'



type AllowedYamlTypes = string | number | boolean
type AllowedTypes = AllowedYamlTypes | AllowedYamlTypes[]

export default class Memiens {
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


	public get<T extends AllowedTypes>(setting: string, defaultValue: T | undefined = undefined): T {
		const props = setting.split('.')
		let root = this.state
		try {
			for (const prop of props)
				root = root[prop]
		} catch (e) {
		}
		if (root) return root
		if (defaultValue) {
			this.set(setting, defaultValue)
			return defaultValue
		}
		throw new Error(`Could not load the setting: "${setting}" and no default value was provided`)
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
		this.state = yaml.parse(readFileSync(this.file, 'utf-8')) || {}
	}


	private save() {
		writeFileSync(this.file, yaml.stringify(this.state), 'utf-8')
	}
}