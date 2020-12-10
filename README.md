# easy-create-react-context
[![NPM Status](https://img.shields.io/npm/v/easy-create-react-context.svg)](https://www.npmjs.com/package/easy-create-react-context)   

 
The tool just encapsulated React.createContext, but it's

**more efficient**, 

**more convenient** when compared to `Reducer + Context` such a combination and
 
**easier** to manage the state of small modules.
You can think of it as mini version of **MobX**, but with the same rendering efficiency.

You can also think of it as my personal black-tech small tool. Hope you enjoy it. 

### [DEMO](https://codesandbox.io/s/easy-create-react-context-h46xx)

## Installation

- YARN

```bash
   yarn add easy-create-react-context
```

- NPM

```bash
   npm i easy-create-react-context
```

## Quick Start

- Create context by invoking `getConTexts`, Use `Provider` to set `contexts` and `value`. 
- Call `updateAsync` of `contexts` that we declared to run some asynchronous functions.

```typescript jsx
import { getConTexts, Provider } from 'easy-create-react-context';

type TExample = InstanceType<typeof Example>;

const contexts = getConTexts<TExample>();

class Example {
  a = 1;
  b(num: number) {
    this.a += num;
  }
  c(num: number) {
    contexts.updateAsync((update) => {
      setTimeout(() => {
        this.a += num;
        update();
      }, 500);
    });
  }
}

const Parent = () => {
  return (
    <Provider<TExample> contexts={contexts} value={new Example()}>
      <Child />
    </Provider>
  );
};
```

- Invoke `useContext` and use `contexts.getContext` as param.(if you prefer class component, use `contexts.getContext('key').Consumer` instead)
- Call `context.dispatch` to update data.

```typescript jsx
const Child = () => {
  const a = useContext(contexts.getContext('a'));
  return (
    <>
      <div>{a}</div>
      <button onClick={() => contexts.dispatch({ type: 'b', params: [1] })}>
        update
      </button>
      <button onClick={() => contexts.dispatch("c", 1)}>
        async update
      </button>
    </>
  );
};
```

## API 


#### getConTexts

```typescript jsx
const contexts = getConTexts() 
```
Used to create context, see also following which is related content of `contexts`.

<hr />

#### Provider

```typescript jsx
<Provider contexts={contexts} value={value} >...</Provider> 
```
Provider data for children.
- contexts: object (required)
- value: object (required)

<hr />

#### context.getContext

```js
const value = React.useContext(context.getContext(key))
```
Obtain current value of the `value` in `Provider`.
- key: string (required)

<hr />

#### context.dispatch

```js
context.dispatch({type: key, params: argsArray})
// or for short
context.dispatch(key, arg1, arg2, ...argN)
// or used to return something that is return statement of the property of instance
return context.dispatch(key) 
 ```
Invoke function of value in `Provider` and render related components, you can also use it to return what is return statement of the property of instance.  
- key: string (required)
- argsArray: Array<arg> (optional)
- argN: the NTH param

<hr />

#### context.updateAsync

```js
contexts.updateAsync(update=>{ update() })
 ```
Used to run asynchronous code.
- update: function (required)

<hr />

## Bug tracker

If you find a bug, please report it [here on Github](https://github.com/zixiCat/easy-create-react-context/issues)!
