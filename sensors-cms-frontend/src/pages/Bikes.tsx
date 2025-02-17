import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import axiosClient from '../lib/axiosClient'
import { jsonFields } from '../lib/jsonHelper'
import ErrorPopup from '../components/ErrorPopup'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

function Bikes() {
  const [axiosError, setAxiosError] = useState<string | null>(null)
  const [bikeData, setBikes] = useState<any | null>(null)

  useEffect(() => {
    axiosClient
      .get('/bikes')
      .then((response: any) => {
        console.log(response)
        setBikes(response.data.bikes)
      })
      .catch((error) => {
        const errorMessage = `Get device data failed: ${error.message}`
        console.error(errorMessage)
        setAxiosError(errorMessage)
      })
  }, [])

  return (
    <>
      {bikeData ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="bikes-table">
            <TableHead>
              <TableRow>
                {Object.keys(bikeData[0]).map((fieldName) => (
                  <StyledTableCell key={fieldName}>{fieldName}</StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bikeData.map((row: any) => (
                <StyledTableRow key={row._id}>
                  {Object.keys(bikeData[0]).map((fieldName) => (
                    <StyledTableCell key={`${row._id}-${fieldName}`}>
                      {jsonFields.includes(fieldName)
                        ? JSON.stringify(row[fieldName])
                        : row[fieldName]}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <h5>Loading data ...</h5>
      )}
      {axiosError && <ErrorPopup errorMessage={axiosError} />}
    </>
  )
}

export default Bikes
