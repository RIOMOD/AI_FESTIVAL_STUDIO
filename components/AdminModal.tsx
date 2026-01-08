
import React, { useState, useEffect } from 'react';
// Fix: Removed the non-existent LOCAL_STORAGE_API_KEY import from geminiService
// Fix: Removed the non-existent ShieldCheckIcon from icons import
import { CogIcon } from './icons';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LOCAL_STORAGE_PASSWORD_KEY = 'APP_ADMIN_PASSWORD';

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
    // Login State
    const [passwordInput, setPasswordInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Fix: Removed API Key management state to comply with security guidelines
    // Change Password State
    const [newPassword, setNewPassword] = useState('');
    
    // UI Feedback
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset state when modal opens
            setPasswordInput('');
            setIsAuthenticated(false);
            setError('');
            setSuccessMsg('');
            setNewPassword('');
        }
    }, [isOpen]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Lấy mật khẩu từ local storage, nếu không có thì mặc định là 'admin'
        const storedPassword = localStorage.getItem(LOCAL_STORAGE_PASSWORD_KEY) || 'admin';
        
        if (passwordInput === storedPassword) {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Mật khẩu không đúng!');
        }
    };

    // Fix: Removed handleSaveKey and related logic as API key management in UI is prohibited

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.trim().length < 4) {
            setError('Mật khẩu mới quá ngắn (tối thiểu 4 ký tự).');
            return;
        }
        localStorage.setItem(LOCAL_STORAGE_PASSWORD_KEY, newPassword.trim());
        setSuccessMsg('Đã đổi mật khẩu thành công!');
        setNewPassword('');
        setError('');
        
        // Clear success msg after a bit
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-600 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center sticky top-0 z-10">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <CogIcon className="w-5 h-5 text-sky-400"/>
                        {isAuthenticated ? 'Cấu hình Hệ thống' : 'Đăng nhập Quản trị'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {!isAuthenticated ? (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-slate-400 text-sm font-semibold mb-2">Mật khẩu</label>
                                <input 
                                    type="password" 
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-500"
                                    placeholder="Nhập mật khẩu"
                                    autoFocus
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}
                            <button 
                                type="submit"
                                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 rounded-lg transition-colors shadow-lg"
                            >
                                Đăng nhập
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-8">
                            {/* Fix: Removed Section 1: Google API Key config section */}

                            {/* Phần: Đổi mật khẩu */}
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <h4 className="text-sky-400 font-bold border-b border-slate-700 pb-2 uppercase text-xs tracking-wider">
                                    Đổi Mật khẩu Quản trị
                                </h4>
                                <div>
                                    <input 
                                        type="text" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all placeholder:text-slate-500 text-sm"
                                        placeholder="Nhập mật khẩu mới..."
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 rounded-lg transition-colors shadow-lg text-sm"
                                >
                                    Cập nhật Mật khẩu
                                </button>
                            </form>
                            
                            {/* Thông báo chung */}
                            <div className="min-h-[20px]">
                                {error && <p className="text-red-400 text-sm font-semibold text-center">{error}</p>}
                                {successMsg && <p className="text-green-400 text-sm font-semibold text-center">{successMsg}</p>}
                            </div>

                            <div className="pt-2 border-t border-slate-700 flex justify-end">
                                <button 
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-white text-xs font-semibold hover:underline"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminModal;
