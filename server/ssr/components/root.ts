import { template } from '../templater';
import { getOilTable } from './oil-table';

export async function getIndex () {
  const [indexTpl, layoutTpl] = await Promise.all([template('root/index.htm'), template('root/layout.htm')]);

  return indexTpl({
    body: layoutTpl({
      oilTable: await getOilTable(),
      propertyTable: '',
    }),
  });
}
