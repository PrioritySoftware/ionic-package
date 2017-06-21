import { ColumnsOptions } from './columnOptions.class';
export interface FormsOptions {[key: string] : FormOptions}

export interface FormOptions
{
    title?: string;
    click?: Function;
    columnsOptions?: ColumnsOptions;
    pos?: number;
}