import { template } from '../templater';
import { OILS } from '../data';
import { OilParams } from '../types';

const getOilParams = (oil: OilParams) => ({ name: oil[1] });

export async function getOilTable () {
  const [rowTpl, tableTpl] = await Promise.all([
    template('oil-table/oil-table-item.htm'),
    template('oil-table/oil-table.htm'),
  ]);

  const oils = OILS.map(getOilParams);
  const rows = rowTpl(oils);

  return tableTpl({ content: rows });
}
