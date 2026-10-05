import { useGetAllUsersQuery, UserAccountDto, useSuspendLandlordMutation, useToggleUserActiveMutation, useUpdateUserMutation, useDeleteUserMutation } from "@/app/errors/listingsApi";
import { Loader2, ShieldX, Users , X, Pencil, Trash2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Loading from '../loading';

function formatDate(date: string | null | undefined): string {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-ZA', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}


export default function UsersTab() {
    const [searchTerm,    setSearchTerm]    = useState('');
    const [roleFilter,    setRoleFilter]    = useState<string>('all');
    const [suspendTarget, setSuspendTarget] = useState<UserAccountDto | null>(null);
    const [suspendReason, setSuspendReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [editTarget,    setEditTarget]    = useState<UserAccountDto | null>(null);
    const [editForm,      setEditForm]      = useState({ fullName: '', email: '', phoneNumber: '' });
    const [editError,     setEditError]     = useState<string | null>(null);
    const [deleteTarget,  setDeleteTarget]  = useState<UserAccountDto | null>(null);
    const [deleteError,   setDeleteError]   = useState<string | null>(null);

    const { data: users = [], refetch ,isLoading} = useGetAllUsersQuery();
    const [toggleActive]  = useToggleUserActiveMutation();
    const [suspendLandlord] = useSuspendLandlordMutation();
    const [updateUser, { isLoading: isSaving }]   = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    if(isLoading){
        return <Loading/>
    }

    const filtered = users.filter(u => {
        const matchSearch = !searchTerm ||
            u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
        return matchSearch && matchRole;
    });

    async function handleToggle(userId: string) {
        try {
            await toggleActive(userId).unwrap();
            toast.success('User status updated');
            refetch();
        } catch {
            toast.error('Failed to update user');
        }
    }

    async function handleSuspend() {
        if (!suspendTarget) return;
        setActionLoading(true);
        try {
            await suspendLandlord({
                landlordId:  suspendTarget.id,
                reason:      suspendReason,
                isSuspended: suspendTarget.isActive,
            }).unwrap();
            toast.success(suspendTarget.isActive ? 'Landlord suspended' : 'Landlord reinstated');
            setSuspendTarget(null);
            setSuspendReason('');
            refetch();
        } catch (err: any) {
            toast.error(err?.data?.Message ?? 'Failed to update landlord');
        } finally {
            setActionLoading(false);
        }
    }

    function openEdit(user: UserAccountDto) {
        setEditForm({ fullName: user.fullName ?? '', email: user.email ?? '', phoneNumber: user.phoneNumber ?? '' });
        setEditError(null);
        setEditTarget(user);
    }

    async function handleSaveEdit() {
        if (!editTarget) return;
        if (!editForm.fullName.trim()) { setEditError('Full name is required.'); return; }
        if (!/^\S+@\S+\.\S+$/.test(editForm.email.trim())) { setEditError('Enter a valid email address.'); return; }
        try {
            await updateUser({
                id:          editTarget.id,
                fullName:    editForm.fullName.trim(),
                email:       editForm.email.trim(),
                phoneNumber: editForm.phoneNumber.trim(),
            }).unwrap();
            toast.success('User updated');
            setEditTarget(null);
            refetch();
        } catch (err: any) {
            setEditError(err?.data?.Message ?? err?.data?.message ?? 'Failed to update user.');
        }
    }

    async function handleDelete() {
        if (!deleteTarget) return;
        try {
            await deleteUser(deleteTarget.id).unwrap();
            toast.success('User deleted');
            setDeleteTarget(null);
            refetch();
        } catch (err: any) {
            setDeleteError(err?.data?.Message ?? err?.data?.message ?? 'Failed to delete user.');
        }
    }

    const roleColors: Record<string, string> = {
        Admin:    'bg-purple-100 text-purple-800 border-purple-200',
        Landlord: 'bg-blue-100   text-blue-800   border-blue-200',
        Student:  'bg-green-100  text-green-800  border-green-200',
    };

    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Manage User Accounts ({filtered.length})
                    </h2>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Search users..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 w-40" />
                        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
                            className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
                            <option value="all">All Roles</option>
                            <option value="Student">Students</option>
                            <option value="Landlord">Landlords</option>
                            <option value="Admin">Admins</option>
                        </select>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-xl border bg-background p-10 text-center">
                        <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
                        <p className="text-sm text-muted-foreground">No users found.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(user => (
                            <div key={user.id}
                                className={`rounded-xl border bg-background p-4 shadow-sm ${!user.isActive ? 'opacity-60 border-red-200 bg-red-50/20' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shrink-0">
                                        {user.fullName?.charAt(0)?.toUpperCase() ?? 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold">{user.fullName}</p>
                                            <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${roleColors[user.role] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                {user.role}
                                            </span>
                                            {!user.isActive && (
                                                <span className="rounded-full bg-red-100 border border-red-200 px-2 py-0.5 text-xs font-semibold text-red-800">
                                                    Suspended
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                    <div className="flex flex-col gap-2 shrink-0">
                                        <button
                                            onClick={() => handleToggle(user.id)}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors ${
                                                user.isActive
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-green-600 hover:bg-green-700'
                                            }`}>
                                            {user.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                        {user.role === 'Landlord' && (
                                            <button
                                                onClick={() => setSuspendTarget(user)}
                                                className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                                                {user.isActive ? ' Suspend' : 'Reinstate'}
                                            </button>
                                        )}
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => openEdit(user)}
                                                title="Edit user"
                                                className="flex flex-1 items-center justify-center rounded-lg border px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => { setDeleteError(null); setDeleteTarget(user); }}
                                                title="Delete user"
                                                className="flex flex-1 items-center justify-center rounded-lg border border-red-200 px-2 py-1.5 text-red-600 hover:bg-red-50">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {suspendTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                        <div className="bg-red-600 px-6 py-5 text-white">
                            <button onClick={() => setSuspendTarget(null)}
                                className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                                <X className="h-4 w-4" />
                            </button>
                            <h2 className="text-lg font-bold">
                                {suspendTarget.isActive ? 'Suspend Landlord' : 'Reinstate Landlord'}
                            </h2>
                            <p className="text-sm text-red-100 mt-0.5">{suspendTarget.fullName}</p>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                                {suspendTarget.isActive
                                    ? '⚠️ Suspending this landlord will delist all their properties and notify them via email.'
                                    : '✓ Reinstating this landlord will allow them to relist their properties.'}
                            </div>
                            {suspendTarget.isActive && (
                                <div>
                                    <label className="text-sm font-semibold">
                                        Reason for Suspension <span className="text-destructive">*</span>
                                    </label>
                                    <textarea rows={3} value={suspendReason}
                                        onChange={e => setSuspendReason(e.target.value)}
                                        placeholder="Explain the reason..."
                                        className="mt-1 w-full rounded-lg border bg-muted/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none" />
                                </div>
                            )}
                            <button onClick={handleSuspend}
                                disabled={actionLoading || (suspendTarget.isActive && !suspendReason.trim())}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldX className="h-4 w-4" />}
                                {suspendTarget.isActive ? 'Confirm Suspension' : 'Reinstate Landlord'}
                            </button>
                            <button onClick={() => setSuspendTarget(null)}
                                className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                        <div className="bg-blue-600 px-6 py-5 text-white">
                            <button onClick={() => setEditTarget(null)} disabled={isSaving}
                                className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                                <X className="h-4 w-4" />
                            </button>
                            <h2 className="text-lg font-bold">Edit User</h2>
                            <p className="text-sm text-blue-100 mt-0.5">{editTarget.role}</p>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            {editError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{editError}</div>
                            )}
                            {([
                                ['fullName',    'Full Name',    'text'],
                                ['email',       'Email',        'email'],
                                ['phoneNumber', 'Phone Number', 'tel'],
                            ] as const).map(([key, label, type]) => (
                                <div key={key} className="space-y-1">
                                    <label className="text-sm font-semibold">{label}</label>
                                    <input
                                        type={type}
                                        value={editForm[key]}
                                        onChange={e => { setEditError(null); setEditForm(f => ({ ...f, [key]: e.target.value })); }}
                                        disabled={isSaving}
                                        className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50" />
                                </div>
                            ))}
                            <p className="text-xs text-muted-foreground">
                                Changing the email also changes the address this user logs in with.
                            </p>
                            <button onClick={handleSaveEdit} disabled={isSaving}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Save Changes
                            </button>
                            <button onClick={() => setEditTarget(null)} disabled={isSaving}
                                className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="relative w-full max-w-md rounded-2xl bg-background shadow-xl overflow-hidden">
                        <div className="bg-red-600 px-6 py-5 text-white">
                            <button onClick={() => setDeleteTarget(null)} disabled={isDeleting}
                                className="absolute right-4 top-4 rounded-full p-1.5 text-white/70 hover:text-white hover:bg-white/10">
                                <X className="h-4 w-4" />
                            </button>
                            <h2 className="text-lg font-bold">Delete User</h2>
                            <p className="text-sm text-red-100 mt-0.5">{deleteTarget.fullName} · {deleteTarget.email}</p>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800 space-y-1">
                                <p className="font-semibold">This permanently removes the account and can&apos;t be undone.</p>
                                <p className="text-xs">
                                    Accounts with applications, tenancies, properties or other history can&apos;t be
                                    deleted. Deactivate those instead so their records are kept.
                                </p>
                            </div>
                            {deleteError && (
                                <div className="rounded-lg border border-red-200 bg-background px-4 py-2.5 text-sm text-red-700">{deleteError}</div>
                            )}
                            <button onClick={handleDelete} disabled={isDeleting}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                Delete Permanently
                            </button>
                            <button onClick={() => setDeleteTarget(null)} disabled={isDeleting}
                                className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}