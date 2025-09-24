import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types';
import { AlertCircle, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

type TableUserProps = {
    users?: User[];
    className?: string;
    showActions?: boolean;
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
};
const ROLE_OPTIONS = ['admin', 'sales', 'spv', 'manager'];

const TableUser = ({ users = [], className = '', showActions = true, onEdit, onDelete }: TableUserProps) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editRole, setEditRole] = useState<string>('user');

    const handleDeleteClick = (user: User) => {
        console.log('Selected user for deletion:', user);
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (selectedUser && onDelete) {
            onDelete(selectedUser);
        }
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };
    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        // fallback kalau user.role belum ada di tipe
        const currentRole = (user as any)?.role ?? 'user';
        setEditRole(currentRole);
        setEditDialogOpen(true);
    };
    const handleEditSave = () => {
        if (!selectedUser || !onEdit) {
            setEditDialogOpen(false);
            setSelectedUser(null);
            return;
        }
        // kirim user dengan role baru ke parent
        const updated = { ...selectedUser, role: editRole } as User;
        onEdit(updated);
        setEditDialogOpen(false);
        setSelectedUser(null);
    };
    return (
        <div className={className}>
            <Table className="p-4">
                <TableHeader>
                    <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Level Akun</TableHead>
                        {showActions && <TableHead className="text-center">Aksi</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <TableRow key={user.id} className="group">
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-muted-foreground">{(user as any).role || 'User'}</TableCell>

                                {showActions && (
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                            {onEdit && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditDialog(user)}
                                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            )}
                                            {onDelete && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={showActions ? 5 : 4} className="h-24 text-center text-muted-foreground">
                                Belum ada data user
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        handleDeleteCancel();
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="text-center">
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            Perhatian!
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription>
                        {selectedUser && (
                            <>
                                Apakah Anda yakin ingin menghapus akun <strong>{selectedUser.name}</strong>?
                                <br />
                                Tindakan ini tidak dapat dibatalkan.
                            </>
                        )}
                    </DialogDescription>
                    <DialogFooter className="flex gap-2">
                        <Button variant="ghost" onClick={handleDeleteCancel}>
                            Batal
                        </Button>
                        <Button variant="destructive" className="text-white" onClick={handleDeleteConfirm}>
                            Ya, Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* EDIT USER DIALOG */}
            <Dialog
                open={editDialogOpen}
                onOpenChange={(open: boolean) => {
                    if (!open) {
                        setEditDialogOpen(false);
                        setSelectedUser(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Ubah Level Akun</DialogTitle>
                        <DialogDescription>
                            {selectedUser ? (
                                <>
                                    Pilih level akun untuk <strong>{selectedUser.name}</strong>.
                                </>
                            ) : (
                                <>Pilih level akun.</>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Level Akun</label>
                        <Select value={editRole} onValueChange={setEditRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLE_OPTIONS.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditDialogOpen(false);
                                setSelectedUser(null);
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleEditSave}
                            disabled={!selectedUser || (selectedUser && ((selectedUser as any).role ?? 'user') === editRole)}
                        >
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TableUser;
