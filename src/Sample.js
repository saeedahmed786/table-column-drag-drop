import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { data } from './data';
import InfiniteScroll from 'react-infinite-scroll-component';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    overflow: 'auto',
});

const headCells = [
    {
        id: 'id',
        numeric: false,
        disablePadding: true,
        label: 'ID',
    },
    {
        id: 'firstName',
        numeric: false,
        disablePadding: true,
        label: 'First Name',
    },
    {
        id: 'lastName',
        numeric: true,
        disablePadding: false,
        label: 'Last Name',
    },
    {
        id: 'fullName', // New cell for full name
        numeric: false,
        disablePadding: true,
        label: 'Full Name', // Label for the full name column
    },
    {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email',
    },
    {
        id: 'city',
        numeric: true,
        disablePadding: false,
        label: 'City',
    },
    {
        id: 'registeredDate',
        numeric: true,
        disablePadding: false,
        label: 'Registered Date (g)',
    },
    {
        id: 'isPrivate',
        numeric: false,
        disablePadding: false,
        label: 'Is Private',
    },
];

function EnhancedTableHead(props) {
    const { columns, setColumns, onRequestSort, order, orderBy, login, saveColumns, loadColumns } = props;

    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const items = reorder(columns, result.source.index, result.destination.index);
        setColumns([...items]);
    };

    const handleSaveColumns = () => {
        localStorage.setItem('columnLayout', JSON.stringify(columns));
    };


    const handleFetchColumns = () => {
        const savedColumns = JSON.parse(localStorage.getItem('columnLayout'));
        if (savedColumns) {
            setColumns(savedColumns);
        } else {
            setColumns(headCells)
        }
    };
    const handleLoadColumns = () => {
        localStorage.removeItem('columnLayout');
        setColumns(headCells)
    };

    useEffect(() => {
        handleFetchColumns(); // Load columns when the component mounts
    }, []);

    return (
        <TableHead>
            {
                login ?
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable" direction="horizontal">
                            {(provided, snapshot) => (
                                <TableRow
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                    {...provided.droppableProps}
                                >
                                    {columns.map((headCell, index) => (
                                        <Draggable key={headCell.id} draggableId={headCell.id} index={index}>
                                            {(provided, snapshot) => (
                                                <TableCell
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                                                    key={headCell.id}
                                                    align="left"
                                                    padding={headCell.disablePadding ? 'none' : 'normal'}
                                                >
                                                    <TableSortLabel
                                                        active={orderBy === headCell.id}
                                                        direction={orderBy === headCell.id ? order : 'asc'}
                                                        onClick={createSortHandler(headCell.id)}
                                                    >
                                                        {headCell.label}
                                                        {orderBy === headCell.id ? (
                                                            <Box component="span" sx={visuallyHidden}>
                                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                            </Box>
                                                        ) : null}
                                                    </TableSortLabel>
                                                </TableCell>
                                            )}
                                        </Draggable>
                                    ))}
                                </TableRow>
                            )}
                        </Droppable>
                    </DragDropContext>
                    :
                    <TableRow>
                        {columns.map((headCell, index) => (
                            <TableCell
                                key={headCell.id}
                                align="left"
                                padding={headCell.disablePadding ? 'none' : 'normal'}
                            >
                                <TableSortLabel
                                    active={orderBy === headCell.id}
                                    direction={orderBy === headCell.id ? order : 'asc'}
                                    onClick={createSortHandler(headCell.id)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.id ? (
                                        <Box component="span" sx={visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </Box>
                                    ) : null}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                    </TableRow>
            }
            <TableRow className='stickyBar'>
                <TableCell colSpan={headCells.length}>
                    <div>
                        <div>
                            <button onClick={handleSaveColumns}>Save</button>
                            <button onClick={handleLoadColumns}>Load</button>
                        </div>
                    </div>
                </TableCell>
            </TableRow>
        </TableHead>
    );
}

export default function EnhancedTable({ login }) {
    const [columns, setColumns] = useState(headCells);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('id');

    // Display only the first 15 items initially
    const initialItems = data.slice(0, 15);
    const [items, setItems] = useState(initialItems);
    const [hasMore, setHasMore] = useState(true); // Enable infinite scroll

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const loadMoreItems = () => {
        // Load more items here
        // You can implement this logic based on your needs
        // For example, load more items from the data array
        const currentItemCount = items.length;
        const newItems = data.slice(currentItemCount, currentItemCount + 10); // Load 10 more items
        setItems([...items, ...newItems]);

        // If you reach the end of the data array, disable infinite scroll
        if (currentItemCount + 10 >= data.length) {
            setHasMore(false);
        }
    };

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={loadMoreItems}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
        >
            <Box sx={{ width: '100%' }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <TableContainer>
                        <Table
                            sx={{ minWidth: 750 }}
                            aria-labelledby="tableTitle"
                            size="medium"
                        >
                            <EnhancedTableHead
                                login={login}
                                columns={columns}
                                setColumns={setColumns}
                                onRequestSort={handleRequestSort}
                                order={order}
                                orderBy={orderBy}
                            />
                            <TableBody>
                                {items
                                    .sort((a, b) => {
                                        const isAsc = order === 'asc';
                                        if (orderBy === 'registeredDate') {
                                            // Sort the registeredDate column as dates
                                            const dateA = new Date(a[orderBy]);
                                            const dateB = new Date(b[orderBy]);
                                            return isAsc ? dateA - dateB : dateB - dateA;
                                        } else if (orderBy === 'fullName') {
                                            // Sort the "Full Name" column
                                            return isAsc
                                                ? `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
                                                : `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
                                        } else if (typeof a[orderBy] === 'string' && typeof b[orderBy] === 'string') {
                                            // Sort other string columns
                                            return isAsc ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
                                        } else {
                                            // Sort other columns as numbers
                                            return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
                                        }
                                    })
                                    .map((row, index) => (
                                        <TableRow key={row.id}>
                                            {
                                                columns.map((item) => (
                                                    <TableCell key={item.id} align="left" padding={item.disablePadding ? 'none' : 'normal'}>
                                                        {item.id === 'isPrivate' ? (row.isPrivate ? 'True' : 'False') : item.id === 'fullName' ? `${row.firstName} ${row.lastName}` : row[item.id]}
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </InfiniteScroll>
    );
}
