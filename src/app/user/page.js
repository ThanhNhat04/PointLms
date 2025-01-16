import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Grid, TextField, Box
} from '@mui/material';
import { Visibility, Edit, Delete, Search } from '@mui/icons-material';


const users = [
    { id: 'HV00075', name: 'Hieu Nguyen', phone: '0898662613', email: 'nhockpro445@gmail.com', gender: 'Nữ', status: 'Đang hoạt động', educationStatus: 'Mới' },
    { id: 'HV00075', name: 'Hieu Nguyen', phone: '0898662613', email: 'nhockpro445@gmail.com', gender: 'Nữ', status: 'Đang hoạt động', educationStatus: 'Mới' },
    { id: 'HV00075', name: 'Hieu Nguyen', phone: '0898662613', email: 'nhockpro445@gmail.com', gender: 'Nữ', status: 'Đang hoạt động', educationStatus: 'Mới' },
    // Add more user data here
];

const UserTable = () => {
    return (
        <>
            <Box sx={{backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 2, mt: 4, minWidth: '90%', width: 'calc(100% - 70px)', minHeight: '100%', height: '800px', mx: 'auto', marginLeft: '20px'}}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                    <Box>
                        <TextField
                            variant="outlined"
                            placeholder="Tìm kiếm"
                            size="small"
                            sx={{ flexGrow: 1, mr: 2, width: '250px' }}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <Search />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                    <Box>
                        <Button variant="contained" color="primary" sx={{ mr: 1 }}>File mẫu</Button>
                        <Button variant="contained" color="secondary" sx={{ mr: 1 }}>Xuất file</Button>
                        <Button variant="contained" color="success">Tạo mới</Button>
                    </Box>
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Thông tin</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Liên hệ</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Giới tính</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Trạng thái</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Trạng thái học</TableCell>
                                <TableCell sx={{ backgroundColor: 'blue', color: 'white', textAlign: 'center' }}>Chức năng</TableCell>
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}<br />{user.id}</TableCell>
                                    <TableCell>Điện thoại: {user.phone}<br />Email: {user.email}</TableCell>
                                    <TableCell>{user.gender}</TableCell>
                                    <TableCell>{user.status}</TableCell>
                                    <TableCell>{user.educationStatus}</TableCell>
                                    {/* <TableCell>
                                        <IconButton><Visibility /></IconButton>
                                        <IconButton><Edit /></IconButton>
                                        <IconButton><Delete /></IconButton>
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default UserTable;
