import React, { Context, createContext, useRef, useState } from 'react';

type TFnPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// The type that each value of object is only function type
type IFnProperties<T> = Pick<T, TFnPropertyNames<T>>;

// The type that each value of object is only non-function type
type IObjProperties<T> = Omit<T, TFnPropertyNames<T>>;

// the interface that is type of action
type TAction<T> = {
  [P in keyof IFnProperties<T>]: {
    type: P;
    params?: {
      [P in keyof IFnProperties<T>]: Parameters<IFnProperties<T>[P]>;
    }[P];
  };
}[keyof IFnProperties<T>];

type TConTexts<T> = {
  dispatch: (action: TAction<T>) => void;
  getContext: (
    type: keyof IObjProperties<T>
  ) => Context<T[keyof IObjProperties<T>]>;
  updateAsync: (update: (setData: () => void) => void) => void;
};

export const getConTexts = <T extends unknown>(): TConTexts<T> => {
  return {} as TConTexts<T>;
};

export const Provider = <T extends unknown>(props: {
  children: React.ReactNode;
  value: T;
  contexts: TConTexts<T>;
}) => {
  const [, setData] = useState(false);
  const context = useRef<any>({});
  const value = useRef<any>(props.value);
  const trigger = useRef(true);
  if (trigger.current) {
    for (const i in value.current) {
      if (value.current.hasOwnProperty(i)) {
        context.current[i] = createContext<unknown>(value.current[i]);
      }
    }
    props.contexts.getContext = (p) => {
      return context.current[p];
    };
    props.contexts.updateAsync = (update: (setData: () => void) => void) => {
      update(() => setData((p) => !p));
      return value.current;
    };
    props.contexts.dispatch = (action) => {
      const res = value.current[action.type](...(action.params || []));
      if (value.current !== res) setData((p) => !p);
    };
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
