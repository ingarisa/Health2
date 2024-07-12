enum ETypeNumber {
    currency = 'currency',
    decimal = 'decimal',
    percent = 'percent'
}

type TNumberFormat = {
    style: keyof typeof ETypeNumber
    min?: number
    max?: number
}

export const numberFormat = (value: number, options?: TNumberFormat): string => {
    const decimalFormat = {
        style: options?.style ?? "decimal",
        minimumFractionDigits: options?.min,
        maximumFractionDigits: options?.max,
    };

    return Intl.NumberFormat("en-US", decimalFormat).format(value)
}
