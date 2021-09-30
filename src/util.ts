type JudgeExactAny<T> = T extends never ? true : false
export type IsAny<T> = boolean extends JudgeExactAny<T> ? true : false
export type IsNever<T> = T[] extends never[] ? true : false
