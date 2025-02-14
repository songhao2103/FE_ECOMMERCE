import { formatCurrencyVND } from "../../utils/format/format.js";
const Grid = ({ columns, datas, config }) => {
  return (
    <div className="grid_utils">
      <table>
        <thead>
          <tr>
            {config.hasMultiSelect && (
              <th>
                <input type="checkbox"></input>
              </th>
            )}

            {columns.map((column, index) => (
              <th key={index} style={{ width: `${column.width}%` }}>
                {column.title}
              </th>
            ))}

            {config.hasDeleteOnRow || (config.hasEditOnRow && <th></th>)}
          </tr>
        </thead>

        <tbody>
          {datas.map((data, index) => (
            <tr key={index}>
              {config.hasMultiSelect && (
                <th>
                  <input type="checkbox"></input>
                </th>
              )}

              {columns.map((row, index) => (
                <td key={index} className={row.type === "name" ? "name" : ""}>
                  {row.type === "image_default" ? (
                    <img src={data[row.dataIndex]?.url}></img>
                  ) : row.type === "money" ? (
                    formatCurrencyVND(data[row.dataIndex])
                  ) : row.type === "subtotal" ? (
                    formatCurrencyVND(
                      config.subtotal(
                        data.price,
                        data.discount,
                        data.quantityOnCart
                      )
                    )
                  ) : row.type === "quantity" ? (
                    <div className="box_quantity">
                      <div className="icon desc">-</div>
                      <p className="quantity desc">{data[row.dataIndex]}</p>
                      <div className="icon desc">+</div>
                    </div>
                  ) : (
                    data[row.dataIndex]
                  )}
                </td>
              ))}

              {(config.hasDeleteOnRow || config.hasEditOnRow) && (
                <td>
                  {config.hasDeleteOnRow && (
                    <button className="detele-row">X</button>
                  )}
                  {config.hasEditOnRow && (
                    <button className="detele-row">E</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
