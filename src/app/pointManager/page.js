'use client';

import { useState } from 'react';
import {
    Typography, Button, Box, TextField, Select, MenuItem, Table,
    TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Checkbox,
    Dialog, DialogTitle, DialogContent, Snackbar, Alert, CircularProgress
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import CommentIcon from '@mui/icons-material/Comment';
import { useSearchParams } from 'next/navigation';

import { assignments } from '@/app/data/assignments';
import { student_users } from '@/app/data/student_users';

export default function LessonPath() {
    const searchParams = useSearchParams();

    const classInfo = {
        name: searchParams.get('name') || "Chưa rõ",
        status: searchParams.get('status') || "",
        teacher: searchParams.get('teacher') || "",
        startDate: searchParams.get('startDate') || "",
        endDate: searchParams.get('endDate') || "",
        schedule: searchParams.get('schedule') || "",
        age: searchParams.get('age') || "",
        sessions: Number(searchParams.get('sessions')) || 0,
        students: Number(searchParams.get('students')) || 0,
        completedSessions: Number(searchParams.get('completedSessions')) || 0,
        curriculum: searchParams.get('curriculum') || "#",
        note: searchParams.get('note') || "",
    };

    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [fieldText, setFieldText] = useState('');
    const [output, setOutput] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [currentComment, setCurrentComment] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const assignmentMap = assignments.reduce((acc, a) => {
        acc[a.id] = a.name;
        return acc;
    }, {});

    const handleSubmit = async () => {
        try {
            setSnackbarMessage('Đang thực thi...');
            setSnackbarOpen(true);

            const newOutput = {};

            for (const user of student_users) {
                for (const sub of user.submissions) {
                    if (!selectedAssignmentId || sub.assignment_id === selectedAssignmentId) {
                        const key = `${user.student_id}-${sub.file.name}`;

                        await new Promise(resolve => setTimeout(resolve, 10000)); // Delay 10s mỗi bài

                        const randomScore = Math.floor(Math.random() * 5 + 6); // 6 - 10
                        const fakeComments = [
                            "Bài làm tốt, cần phát huy thêm.",
                            "Nội dung rõ ràng nhưng còn thiếu dẫn chứng.",
                            "Cần cải thiện cách trình bày.",
                            "Ý tưởng sáng tạo, tuy nhiên cần logic hơn.",
                            "Thiếu một vài phần chính nhưng cố gắng tốt."
                        ];
                        const comment = fakeComments[Math.floor(Math.random() * fakeComments.length)];

                        newOutput[key] = { score: randomScore, comment };
                        sub.score = randomScore.toString();

                        setOutput(prev => ({ ...prev, [key]: { score: randomScore, comment } }));
                    }
                }
            }

            setSnackbarMessage('Hoàn thành chấm điểm!');
            setTimeout(() => setSnackbarOpen(false), 2000);
        } catch (error) {
            console.error('Lỗi khi chấm điểm:', error);
            setSnackbarMessage('Đã xảy ra lỗi!');
            setTimeout(() => setSnackbarOpen(false), 2000);
        }
    };

    const renderTable = () => {
        return student_users.flatMap(user => {
            return user.submissions
                .filter(s => selectedAssignmentId ? s.assignment_id === selectedAssignmentId : true)
                .map((submission) => {
                    const key = `${user.student_id}-${submission.file.name}`;
                    return (
                        <TableRow key={key}>
                            <TableCell><Checkbox /></TableCell>
                            <TableCell>{user.student_name}</TableCell>
                            <TableCell>{user.student_id}</TableCell>
                            <TableCell>{assignmentMap[submission.assignment_id] || 'Bài tập'}</TableCell>
                            <TableCell>{submission.assignment_type}</TableCell>
                            <TableCell>
                                <a href={`${submission.file.url}`} target="_blank" rel="noopener noreferrer">
                                    <DescriptionIcon sx={{ verticalAlign: 'middle' }} /> {submission.file.name}
                                </a>
                            </TableCell>
                            <TableCell>
                                {output[key]?.comment ? (
                                    <CommentIcon
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setCurrentComment(output[key].comment);
                                            setOpenDialog(true);
                                        }}
                                    />
                                ) : (
                                    <Typography variant="body2" color="text.secondary">Chưa có nhận xét</Typography>
                                )}
                            </TableCell>
                            <TableCell>
                                <TextField
                                    variant="outlined"
                                    size="small"
                                    value={output[key]?.score || submission.score || ''}
                                    sx={{ width: 60 }}
                                    InputProps={{ readOnly: true }}
                                />
                            </TableCell>
                        </TableRow>
                    );
                });
        });
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, backgroundColor: 'white', borderRadius: 2, p: 2, mt: 4, mx: 'auto' }}>
                <Box sx={{ backgroundColor: '#e3f2fd', borderRadius: 2, p: 3, flex: 1, boxShadow: 1, maxWidth: '840px' }}>
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>{classInfo.name}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="body2"><strong>Giáo viên:</strong> {classInfo.teacher}</Typography>
                        <Typography variant="body2"><strong>Trạng thái:</strong> {classInfo.status}</Typography>
                        <Typography variant="body2"><strong>Thời gian:</strong> {classInfo.startDate} → {classInfo.endDate}</Typography>
                        <Typography variant="body2"><strong>Lịch học:</strong> {classInfo.schedule}</Typography>
                        <Typography variant="body2"><strong>Độ tuổi:</strong> {classInfo.age}</Typography>
                        <Typography variant="body2"><strong>Sĩ số:</strong> {classInfo.students}</Typography>
                        <Typography variant="body2"><strong>Buổi đã học:</strong> {classInfo.completedSessions}/{classInfo.sessions}</Typography>
                        <Typography variant="body2"><strong>Giáo trình:</strong> <a href={classInfo.curriculum} target="_blank" rel="noopener noreferrer">Xem tại đây</a></Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ p: 2, backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: 2 }}>
                            <Typography variant="subtitle1">Tải tài liệu</Typography>
                            <Typography variant="body2">Giáo viên có thể chia sẻ bài giảng hoặc học liệu với học sinh</Typography>
                        </Box>
                        <Box sx={{ p: 2, backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: 2 }}>
                            <Typography variant="subtitle1">Hướng dẫn lớp</Typography>
                            <Typography variant="body2">Thiết lập quy tắc, nội dung hướng dẫn cho từng tiết học</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 2, mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1">Chọn bài tập để xem đề bài:</Typography>
                        <Select
                            value={selectedAssignmentId}
                            onChange={(e) => setSelectedAssignmentId(e.target.value)}
                            fullWidth
                            displayEmpty
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="">-- Chọn bài tập --</MenuItem>
                            {assignments.map(assignment => (
                                <MenuItem key={assignment.id} value={assignment.id}>
                                    {assignment.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Nhập tiêu chí"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={8}
                            value={fieldText}
                            onChange={(e) => setFieldText(e.target.value)}
                        />
                        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
                            Chấm điểm
                        </Button>
                    </Box>
                    <Box sx={{ flex: 1, backgroundColor: '#f5f5f5', borderRadius: 1, p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Đề bài:</Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                mt: 1,
                                whiteSpace: 'pre-wrap',
                                maxHeight: '270px',
                                overflowY: 'auto',
                                border: '1px solid #ddd',
                                p: 1,
                                borderRadius: 1,
                                backgroundColor: '#fafafa'
                            }}
                        >
                            {assignments.find(a => a.id === selectedAssignmentId)?.prompt || 'Vui lòng chọn bài tập để xem đề bài.'}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, boxShadow: 2, mt: 4 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><Checkbox /></TableCell>
                                <TableCell>TÊN SINH VIÊN</TableCell>
                                <TableCell>Mã học sinh</TableCell>
                                <TableCell>BÀI TẬP</TableCell>
                                <TableCell>Loại bài</TableCell>
                                <TableCell>File bài nộp</TableCell>
                                <TableCell>Nhận xét</TableCell>
                                <TableCell>Điểm</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderTable()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Phản hồi chi tiết</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                        {currentComment}
                    </Typography>
                </DialogContent>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert icon={<CircularProgress size={18} />} severity="info" sx={{ display: 'flex', alignItems: 'center' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}
