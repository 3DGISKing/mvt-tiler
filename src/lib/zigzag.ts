const zigzag = (value: number) => (value << 1) ^ (value >> 31)

export default zigzag;