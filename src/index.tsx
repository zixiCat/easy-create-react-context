import React, { Context, createContext, useRef, useState } from 'react';

interface IConTexts<T> {
  // Invoke function of value in Provider and render related components
  dispatch: UnionToIntersection<TDispatch<T>[keyof TDispatch<T>]> &
    UnionToIntersection<TDispatchForShort<T>[keyof TDispatchForShort<T>]>;
  // Obtain current value of the value in Provider
  getContext: UnionToIntersection<TConTexts<T>[keyof TConTexts<T>]>;
  // Used to run asynchronous code
  updateAsync: (update: (setData: () => void) => void) => void;
}

interface IProps<T> {
  // React node
  children: React.ReactNode;
  // Object instance
  value: T;
  // The context created by getConTexts
  contexts: IConTexts<T>;
}

type TFnPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type TNotFnPropertyNames<T> = Exclude<keyof T, TFnPropertyNames<T>>;

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never;

type TDispatch<T> = {
  [P in TFnPropertyNames<T>]: (action: {
    type: P;
    params?: Parameters<T[P]>;
  }) => T[P];
};

type TDispatchForShort<T> = {
  [P in TFnPropertyNames<T>]: (
    type: P,
    ...rest: Parameters<T[P]>
  ) => ReturnType<T[P]>;
};

type TConTexts<T> = {
  [P in TNotFnPropertyNames<T>]: (type: P) => Context<T[P]>;
};

// Used to create context, see also following which is related content of contexts
export const getConTexts = <T extends unknown>(): IConTexts<T> => {
  return {} as IConTexts<T>;
};

// Provider data for children
export const Provider = <T extends unknown>(props: IProps<T>) => {
  const [, setData] = useState(0);
  const value = useRef<any>(props.value);
  const context = useRef<any>({});
  const trigger = useRef(true);
  if (trigger.current) {
    for (const i in value.current) {
      if (value.current.hasOwnProperty(i)) {
        context.current[i] = createContext<unknown>(value.current[i]);
      }
    }
    props.contexts.getContext = ((p: keyof T) => {
      return context.current[p];
    }) as any;
    props.contexts.updateAsync = (update: (setData: () => void) => void) => {
      update(() => setData((p) => p + 1));
      return value.current;
    };
    props.contexts.dispatch = ((action: any, ...rest: any) => {
      if (typeof action === 'object') {
        const res = value.current[action.type](...(action.params || []));
        if (value.current !== res) setData((p) => p + 1);
        return res;
      } else {
        const res = value.current[action](...(rest || []));
        if (value.current !== res) setData((p) => p + 1);
        return res;
      }
    }) as any;
    trigger.current = false;
  }

  return (
    <>
      {Object.values(context.current)
        .map((i: any) => i.Provider)
        .reduceRight((acc, Comp, index) => {
          return <Comp value={Object.values(value.current)[index]}>{acc}</Comp>;
        }, props.children)}
    </>
  );
};
