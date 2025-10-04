import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Organization } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { CheckCircle, AlertCircle, Save, Settings, Bell, Shield, Palette, Globe } from 'lucide-react';

interface OrganizationPreferencesProps extends PageProps {
  organization: Organization;
  preferences: {
    system: {
      auto_backup: boolean;
      backup_frequency: string;
      data_retention_days: number;
      log_level: string;
    };
    notifications: {
      email_digest: boolean;
      digest_frequency: string;
      system_alerts: boolean;
      security_alerts: boolean;
      maintenance_notices: boolean;
    };
    security: {
      session_timeout: number;
      password_expiry_days: number;
      failed_login_lockout: boolean;
      ip_whitelist: string[];
      audit_logging: boolean;
    };
    display: {
      default_theme: string;
      language: string;
      timezone: string;
      date_format: string;
      items_per_page: number;
    };
  };
}

const OrganizationPreferences: React.FC<OrganizationPreferencesProps> = ({ 
  auth, 
  organization, 
  preferences 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data, setData, put, processing, errors, reset } = useForm({
    system: {
      auto_backup: preferences.system.auto_backup,
      backup_frequency: preferences.system.backup_frequency,
      data_retention_days: preferences.system.data_retention_days,
      log_level: preferences.system.log_level,
    },
    notifications: {
      email_digest: preferences.notifications.email_digest,
      digest_frequency: preferences.notifications.digest_frequency,
      system_alerts: preferences.notifications.system_alerts,
      security_alerts: preferences.notifications.security_alerts,
      maintenance_notices: preferences.notifications.maintenance_notices,
    },
    security: {
      session_timeout: preferences.security.session_timeout,
      password_expiry_days: preferences.security.password_expiry_days,
      failed_login_lockout: preferences.security.failed_login_lockout,
      ip_whitelist: preferences.security.ip_whitelist.join('\n'),
      audit_logging: preferences.security.audit_logging,
    },
    display: {
      default_theme: preferences.display.default_theme,
      language: preferences.display.language,
      timezone: preferences.display.timezone,
      date_format: preferences.display.date_format,
      items_per_page: preferences.display.items_per_page,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const submitData = {
      ...data,
      security: {
        ...data.security,
        ip_whitelist: data.security.ip_whitelist.split('\n').filter(ip => ip.trim()),
      },
    };

    put(route('organization.preferences.update'), {
      data: submitData,
      onSuccess: () => {
        setMessage({ type: 'success', text: '偏好設定已成功更新！' });
        setIsLoading(false);
      },
      onError: () => {
        setMessage({ type: 'error', text: '更新失敗，請檢查輸入的資料。' });
        setIsLoading(false);
      },
    });
  };

  const backupFrequencies = [
    { value: 'daily', label: '每日' },
    { value: 'weekly', label: '每週' },
    { value: 'monthly', label: '每月' },
  ];

  const logLevels = [
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
  ];

  const digestFrequencies = [
    { value: 'daily', label: '每日' },
    { value: 'weekly', label: '每週' },
    { value: 'monthly', label: '每月' },
  ];

  const themes = [
    { value: 'light', label: '淺色主題' },
    { value: 'dark', label: '深色主題' },
    { value: 'auto', label: '自動' },
  ];

  const languages = [
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'zh-CN', label: '簡體中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
  ];

  const timezones = [
    { value: 'Asia/Taipei', label: '台北 (UTC+8)' },
    { value: 'Asia/Tokyo', label: '東京 (UTC+9)' },
    { value: 'Asia/Shanghai', label: '上海 (UTC+8)' },
    { value: 'UTC', label: 'UTC (UTC+0)' },
  ];

  const dateFormats = [
    { value: 'Y-m-d', label: '2024-01-01' },
    { value: 'd/m/Y', label: '01/01/2024' },
    { value: 'm/d/Y', label: '01/01/2024' },
    { value: 'd-m-Y', label: '01-01-2024' },
  ];

  return (
    <AppLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            組織偏好設定
          </h2>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">{organization.name}</span>
          </div>
        </div>
      }
    >
      <Head title="組織偏好設定" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {message && (
            <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="system" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="system">系統設定</TabsTrigger>
                <TabsTrigger value="notifications">通知設定</TabsTrigger>
                <TabsTrigger value="security">安全設定</TabsTrigger>
                <TabsTrigger value="display">顯示設定</TabsTrigger>
              </TabsList>

              <TabsContent value="system" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>系統設定</CardTitle>
                    <CardDescription>
                      設定系統的基本運作參數
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto_backup">自動備份</Label>
                        <p className="text-sm text-gray-500">
                          啟用系統自動備份功能
                        </p>
                      </div>
                      <Switch
                        id="auto_backup"
                        checked={data.system.auto_backup}
                        onCheckedChange={(checked) =>
                          setData('system', { ...data.system, auto_backup: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backup_frequency">備份頻率</Label>
                      <Select
                        value={data.system.backup_frequency}
                        onValueChange={(value) =>
                          setData('system', { ...data.system, backup_frequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選擇備份頻率" />
                        </SelectTrigger>
                        <SelectContent>
                          {backupFrequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data_retention_days">資料保留天數</Label>
                      <Input
                        id="data_retention_days"
                        type="number"
                        min="1"
                        max="3650"
                        value={data.system.data_retention_days}
                        onChange={(e) =>
                          setData('system', {
                            ...data.system,
                            data_retention_days: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="log_level">日誌等級</Label>
                      <Select
                        value={data.system.log_level}
                        onValueChange={(value) =>
                          setData('system', { ...data.system, log_level: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選擇日誌等級" />
                        </SelectTrigger>
                        <SelectContent>
                          {logLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2" />
                      通知設定
                    </CardTitle>
                    <CardDescription>
                      設定組織的通知偏好
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email_digest">電子郵件摘要</Label>
                        <p className="text-sm text-gray-500">
                          定期接收系統活動摘要
                        </p>
                      </div>
                      <Switch
                        id="email_digest"
                        checked={data.notifications.email_digest}
                        onCheckedChange={(checked) =>
                          setData('notifications', {
                            ...data.notifications,
                            email_digest: checked,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="digest_frequency">摘要頻率</Label>
                      <Select
                        value={data.notifications.digest_frequency}
                        onValueChange={(value) =>
                          setData('notifications', {
                            ...data.notifications,
                            digest_frequency: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="選擇摘要頻率" />
                        </SelectTrigger>
                        <SelectContent>
                          {digestFrequencies.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="system_alerts">系統警報</Label>
                          <p className="text-sm text-gray-500">
                            接收系統相關的警報通知
                          </p>
                        </div>
                        <Switch
                          id="system_alerts"
                          checked={data.notifications.system_alerts}
                          onCheckedChange={(checked) =>
                            setData('notifications', {
                              ...data.notifications,
                              system_alerts: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="security_alerts">安全警報</Label>
                          <p className="text-sm text-gray-500">
                            接收安全相關的重要警報
                          </p>
                        </div>
                        <Switch
                          id="security_alerts"
                          checked={data.notifications.security_alerts}
                          onCheckedChange={(checked) =>
                            setData('notifications', {
                              ...data.notifications,
                              security_alerts: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="maintenance_notices">維護通知</Label>
                          <p className="text-sm text-gray-500">
                            接收系統維護相關通知
                          </p>
                        </div>
                        <Switch
                          id="maintenance_notices"
                          checked={data.notifications.maintenance_notices}
                          onCheckedChange={(checked) =>
                            setData('notifications', {
                              ...data.notifications,
                              maintenance_notices: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      安全設定
                    </CardTitle>
                    <CardDescription>
                      設定組織的安全政策
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="session_timeout">會話超時時間 (分鐘)</Label>
                      <Input
                        id="session_timeout"
                        type="number"
                        min="5"
                        max="1440"
                        value={data.security.session_timeout}
                        onChange={(e) =>
                          setData('security', {
                            ...data.security,
                            session_timeout: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_expiry_days">密碼過期天數</Label>
                      <Input
                        id="password_expiry_days"
                        type="number"
                        min="0"
                        max="365"
                        value={data.security.password_expiry_days}
                        onChange={(e) =>
                          setData('security', {
                            ...data.security,
                            password_expiry_days: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="failed_login_lockout">登入失敗鎖定</Label>
                        <p className="text-sm text-gray-500">
                          多次登入失敗後鎖定帳戶
                        </p>
                      </div>
                      <Switch
                        id="failed_login_lockout"
                        checked={data.security.failed_login_lockout}
                        onCheckedChange={(checked) =>
                          setData('security', {
                            ...data.security,
                            failed_login_lockout: checked,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ip_whitelist">IP 白名單</Label>
                      <Textarea
                        id="ip_whitelist"
                        value={data.security.ip_whitelist}
                        onChange={(e) =>
                          setData('security', {
                            ...data.security,
                            ip_whitelist: e.target.value,
                          })
                        }
                        placeholder="每行一個 IP 地址&#10;例如：&#10;192.168.1.1&#10;10.0.0.1"
                        rows={4}
                      />
                      <p className="text-sm text-gray-500">
                        每行一個 IP 地址，留空表示不限制
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="audit_logging">審計日誌</Label>
                        <p className="text-sm text-gray-500">
                          記錄所有用戶操作活動
                        </p>
                      </div>
                      <Switch
                        id="audit_logging"
                        checked={data.security.audit_logging}
                        onCheckedChange={(checked) =>
                          setData('security', {
                            ...data.security,
                            audit_logging: checked,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="display" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      顯示設定
                    </CardTitle>
                    <CardDescription>
                      設定系統的顯示偏好
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="default_theme">預設主題</Label>
                        <Select
                          value={data.display.default_theme}
                          onValueChange={(value) =>
                            setData('display', {
                              ...data.display,
                              default_theme: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇主題" />
                          </SelectTrigger>
                          <SelectContent>
                            {themes.map((theme) => (
                              <SelectItem key={theme.value} value={theme.value}>
                                {theme.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">語言</Label>
                        <Select
                          value={data.display.language}
                          onValueChange={(value) =>
                            setData('display', {
                              ...data.display,
                              language: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇語言" />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone">時區</Label>
                        <Select
                          value={data.display.timezone}
                          onValueChange={(value) =>
                            setData('display', {
                              ...data.display,
                              timezone: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇時區" />
                          </SelectTrigger>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date_format">日期格式</Label>
                        <Select
                          value={data.display.date_format}
                          onValueChange={(value) =>
                            setData('display', {
                              ...data.display,
                              date_format: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇日期格式" />
                          </SelectTrigger>
                          <SelectContent>
                            {dateFormats.map((format) => (
                              <SelectItem key={format.value} value={format.value}>
                                {format.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="items_per_page">每頁顯示項目數</Label>
                        <Input
                          id="items_per_page"
                          type="number"
                          min="10"
                          max="100"
                          value={data.display.items_per_page}
                          onChange={(e) =>
                            setData('display', {
                              ...data.display,
                              items_per_page: parseInt(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={processing}
              >
                重設
              </Button>
              <Button
                type="submit"
                disabled={processing}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{processing ? '儲存中...' : '儲存設定'}</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default OrganizationPreferences;
