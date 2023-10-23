import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useNotify } from "../../../context/SnackBarContext";

export function MetricTable({
  selectedPagePath,
  tableData
}) {
  const notify = useNotify();
  const [headers, setHeaders] = useState([]);
  const [data, setData] = useState([]);

  const convertData = async () => {
    if (tableData.length !== 0) {
        try {
          const truncatedData = tableData.tableData.data.map((row) => {
            return row.map((col) => {
              // will not attempt conversion on a path
              if (Number(col)) {
                return Number(Math.round(col + "e" + 2) + "e-" + 2);
              } else {
                return col;
              }
            });
          });
  
          setHeaders(tableData.tableData.headers);
          setData(truncatedData);
        } catch (error) {
          notify.current.error(error.message);
        }
      }
  }

  useEffect( () => {
    convertData()
  }, [tableData, selectedPagePath]);

  return (
    <>
        {headers.length && data.length ? (
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((item) => (
                  <TableCell>
                    {item.replace(/([A-Z])/g, " $1").trim()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((data, i) => {
                return (
                  <TableRow
                    sx={{
                      backgroundColor:
                        selectedPagePath.length !== 0
                          ? selectedPagePath.includes(data[0])
                            ? "#ffffff"
                            : "#f2f4fb"
                          : "#ffffff",
                    }}
                  >
                    {data.map((field) => (
                      <TableCell>{field}</TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          "No content performance data to display"
        )}
    </>
  );
}
