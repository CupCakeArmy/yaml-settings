# Memiens 🧠

YAML Settings utility. Nested getter with optional default value and a setter.

**Typescript typings included**

## Quickstart 🚀

```
npm i -s memiens
```

```typescript
import Memiens from 'memiens'

// Initialize by giving a location for the config file.
const MySettings = new Memiens('./config.yml')

// This will throw an error if `someconfigvalue` is not found in the yaml
const A = MySettings.get('someconfigvalue')

// This will not throw an error if `B` is not found
const B = MySettings.get('B', 'this value is returned and written to the yaml if the config entry does not exist')

// This will look for nested values inside the yaml
const C = MySettings.get('my.nested.config.value')

// Write something
MySettings.set('password', 'this is a secret')
// Nested 
MySettings.set('config.db.user', 'my_db_user')
MySettings.set('config.db.port', 1234)
```

## API 📒

### `.get(setting, default [optional])`

###### Behavior
Settings can be simple or nested properties.
If a default value is not provided it will throw an error in case the value is not set. Otherwise the default value will be written into the yaml and returned to the user.

###### Examples


```yaml
# test.yml

db:
    user: myUser
    password: $ecr3t
    port: 1234

simple: a string
```

```typescript
import Memiens from 'memiens'
const Settings = new Memiens('./test.yml')

const simple = Settings.get('simple') // 'a string'
const db = Settings.get('db') // {user: 'myUser', ...}
const user = Settings.get('db.user') // 'myUser'

Settings.get('db').user === Settings.get('db.user') // true

Settings.get('notfound') // throws Error
Settings.get('notfound', 404) // Sets 'notfound' to 404 and returns 404
```

### `.set(setting, value)`

###### Behavior
Settings can be simple or nested properties.
Values can be `string`, `number`, `boolean` or a nested object of those

###### Examples


```typescript
import Memiens from 'memiens'
const Settings = new Memiens('./result.yml')

const config = {
	a: true,
	db: {
		user: 'myUser',
		password: '$ecr3t',
		port: 1234,
	}
}

Settings.set('a', config.a)
Settings.set('db', config.db)
```

```yaml
# result.yml

a: true
db:
    user: myUser
    password: $ecr3t
    port: 1234
```
