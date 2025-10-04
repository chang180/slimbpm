import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Mail, 
  Copy, 
  Send, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'sent' | 'accepted' | 'expired';
  sentAt: string;
  expiresAt: string;
}

interface MemberInvitationProps {
  organizationSlug: string;
  maxUsers: number;
  currentUsers: number;
  invitations: Invitation[];
  onSendInvitation: (data: { emails: string[], role: string, message?: string }) => void;
  onResendInvitation: (id: string) => void;
  onCancelInvitation: (id: string) => void;
}

export default function MemberInvitation({
  organizationSlug,
  maxUsers,
  currentUsers,
  invitations,
  onSendInvitation,
  onResendInvitation,
  onCancelInvitation
}: MemberInvitationProps) {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [emails, setEmails] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const remainingSlots = maxUsers - currentUsers;
  const usagePercentage = (currentUsers / maxUsers) * 100;

  const handleSendInvitation = async () => {
    if (!emails.trim()) return;
    
    setIsLoading(true);
    try {
      const emailList = emails.split('\n').map(email => email.trim()).filter(Boolean);
      await onSendInvitation({
        emails: emailList,
        role,
        message: message.trim() || undefined
      });
      
      setEmails('');
      setMessage('');
      setShowInviteForm(false);
    } catch (error) {
      console.error('發送邀請失敗:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/register?org=${organizationSlug}`;
    navigator.clipboard.writeText(inviteLink);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'sent':
        return <Mail className="w-4 h-4 text-blue-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '等待發送';
      case 'sent':
        return '已發送';
      case 'accepted':
        return '已接受';
      case 'expired':
        return '已過期';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* 邀請統計 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            成員邀請管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentUsers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                已註冊成員
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {remainingSlots}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                剩餘名額
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {invitations.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                待處理邀請
              </div>
            </div>
          </div>

          {/* 使用率進度條 */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>企業成員使用率</span>
              <span>{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  usagePercentage >= 90 ? 'bg-red-500' : 
                  usagePercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* 快速邀請按鈕 */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => setShowInviteForm(true)}
              className="flex items-center gap-2"
              disabled={remainingSlots <= 0}
            >
              <UserPlus className="w-4 h-4" />
              邀請新成員
            </Button>
            <Button 
              variant="outline" 
              onClick={copyInviteLink}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              複製邀請連結
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 邀請表單 */}
      {showInviteForm && (
        <Card>
          <CardHeader>
            <CardTitle>發送邀請</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emails">電子郵件地址</Label>
              <Textarea
                id="emails"
                placeholder="輸入電子郵件地址，每行一個&#10;example1@company.com&#10;example2@company.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                rows={4}
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                每行輸入一個電子郵件地址，最多可邀請 {remainingSlots} 人
              </p>
            </div>

            <div>
              <Label htmlFor="role">預設角色</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="user">一般用戶</option>
                <option value="manager">部門主管</option>
                <option value="admin">系統管理員</option>
              </select>
            </div>

            <div>
              <Label htmlFor="message">邀請訊息 (選填)</Label>
              <Textarea
                id="message"
                placeholder="輸入個人化的邀請訊息..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleSendInvitation}
                disabled={!emails.trim() || isLoading}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isLoading ? '發送中...' : '發送邀請'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInviteForm(false)}
              >
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 邀請列表 */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              邀請記錄
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div 
                  key={invitation.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(invitation.status)}
                    <div>
                      <div className="font-medium">{invitation.email}</div>
                      <div className="text-sm text-gray-500">
                        角色: {invitation.role === 'admin' ? '系統管理員' : 
                               invitation.role === 'manager' ? '部門主管' : '一般用戶'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(invitation.status)}>
                      {getStatusText(invitation.status)}
                    </Badge>
                    
                    <div className="flex gap-2">
                      {invitation.status === 'sent' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onResendInvitation(invitation.id)}
                        >
                          重新發送
                        </Button>
                      )}
                      {invitation.status !== 'accepted' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCancelInvitation(invitation.id)}
                        >
                          取消
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
