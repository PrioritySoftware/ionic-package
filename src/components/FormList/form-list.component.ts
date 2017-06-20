import { Component, Input, ContentChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Form } from '../../entities/form.class';
import { ItemOptions } from '../../entities/itemOptions.class';
import { ColumnsOptions } from '../../entities/columnOptions.class';
import { Constants } from '../../constants.config';
import * as numeral from 'numeral';

@Component({
  selector: 'form-list',
  templateUrl: 'form-list.html',
  encapsulation: ViewEncapsulation.None
})
export class FormList {

    /**
     * This component is used to display an array of 'Priority Rows' of a 'Priority Form' as a list.
     * Inputs:
     * 'Form' - The form object (returned by the api with startForm) of the list to diplay.
     * 'Items' - An Array (not object!!!) of the form rows to display.
     * Optional Inputs:
     * 'Filter'- An object where the key is a 'Priority Column' name, and the value is the column's value to filter.
     * for example:
     * {
     *     'CUST': '333',
     *     'CSTDES': '333'
     * }
     * filters customers whose name or number contains '333'.
     * 'Sort' - A 'Priority Column' name for sorting the list.
     * The sort direction could be defined with the 'sortDirection' property defined in the column in columnsOptions. (value: 1 or -1)
     * 'Subforms' - An array of 'Priority Subform' names that will be displayed in each item - when it is expanded. see 'form-card-item'.
     */

    dirByLang;

    @Input('Form') form : Form;
    @Input('Items') items: any[];
    @Input('Filter') filter;
    @Input('Sort') sortColumn;
   
    itemOptions: ItemOptions = {};
    @Input() set ItemOptions(itemOptions: ItemOptions)
    {
        this.itemOptions = itemOptions;
    }
    columnsOptions: ColumnsOptions = {};
    @Input() set ColumnsOptions(columnsOptions: ColumnsOptions)
    {
        this.columnsOptions = columnsOptions;
    }

    @Input() set card(val)
    {
        this._type = 'card';
    }

    @Input() set default(val)
    {
        this._type = 'default';
    }

    _type = 'default';
    @Input() set type(val)
    {
        this._type = val ? val : 'default';
    }

     _inline = true;
    @Input() set inline(val)
    {
        this._inline = val;
    }

    constructor()
    {
    	this.dirByLang = Constants.dirByLang;
    }

    isShow(val, filterVal, filterType) : boolean
    {
        if(filterVal == '')
        {
           return true;
        }
        else if(val != null)
        {

            switch (filterType)
            {
                case 'equals':
                    return val == filterVal;
                case 'includes':
                    return val.includes(filterVal);
                case 'startsWith':
                    return val.startsWith(filterVal);
            }
        }
        return false
    }

    filterItems = (item,filters) =>
    {
        if(filters === undefined || filters.length === 0)
        {
            return true;
        }
        for (var ind in filters)
        {
            let filter = filters[ind];
            if(typeof filter.value === 'object')
            {
                for (var i in filter.value)
                {
                    if(this.isShow(item[filter.column],filter.value[i],filter.type))
                    {
                        return true;
                    }
                }
            }
            else
            {
                if(this.isShow(item[filter.column],filter.value,filter.type))
                {
                    return true;
                }
            }  
        }
        return false;
    }

    sortItems = (item1,item2,sort) =>
    {
        if(sort === undefined || sort.column === undefined)
        {
            return 0;
        }
        let sortDirection = sort.direction ? sort.direction : 1;
        let sortColumn = sort.column;
        let val1 = item1[sortColumn];
        let val2 = item2[sortColumn];
        if(this.form.columns[sortColumn].type == 'number')
        {
            val1 = numeral(val1)._value;
            val2 = numeral(val2)._value;
        }
        if( val1  > val2)
        {
            return 1 * sortDirection;
        }
        else if( val1 < val2 )
        {
            return -1 * sortDirection;
        }
        return 0;
    }
          
}
