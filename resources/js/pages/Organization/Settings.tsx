import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps, Organization, OrganizationSettingsFormData } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Switch } from '@/Components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { CheckCircle, AlertCircle, Save, Settings, Shield, Palette } from 'lucide-react';

interface OrganizationSettingsProps extends PageProps {
  organization: Organization;
  settings: OrganizationSettingsFormData;
}

const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ auth, organization, settings }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { data, setData, put, processing, errors, reset } = useForm<OrganizationSettingsFormData>({
    timezone: settings.timezone || 'Asia/Taipei',
    language: settings.language || 'zh-TW',
    date_format: settings.date_format || 'Y-m-d',
    time_format: settings.time_format || 'H:i',
    currency: settings.currency || 'TWD',
    notifications: {
      email_notifications: settings.notifications?.email_notifications ?? true,
      system_notifications: settings.notifications?.system_notifications ?? true,
      security_notifications: settings.notifications?.security_notifications ?? true,
    },
    security: {
      password_policy: {
        min_length: settings.security?.password_policy?.min_length ?? 8,
        require_uppercase: settings.security?.password_policy?.require_uppercase ?? true,
        require_lowercase: settings.security?.password_policy?.require_lowercase ?? true,
        require_numbers: settings.security?.password_policy?.require_numbers ?? true,
        require_symbols: settings.security?.password_policy?.require_symbols ?? false,
      },
      session_timeout: settings.security?.session_timeout ?? 120,
      two_factor_required: settings.security?.two_factor_required ?? false,
    },
    appearance: {
      theme: settings.appearance?.theme ?? 'auto',
      primary_color: settings.appearance?.primary_color ?? '#3b82f6',
      logo_url: settings.appearance?.logo_url ?? '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    put(route('organization.settings.update'), {
      onSuccess: () => {
        setMessage({ type: 'success', text: '組織設定已成功更新！' });
        setIsLoading(false);
      },
      onError: () => {
        setMessage({ type: 'error', text: '更新失敗，請檢查輸入的資料。' });
        setIsLoading(false);
      },
    });
  };

  const timezones = [
    { value: 'Asia/Taipei', label: '台北 (UTC+8)' },
    { value: 'Asia/Tokyo', label: '東京 (UTC+9)' },
    { value: 'Asia/Shanghai', label: '上海 (UTC+8)' },
    { value: 'UTC', label: 'UTC (UTC+0)' },
    { value: 'America/New_York', label: '紐約 (UTC-5)' },
    { value: 'Europe/London', label: '倫敦 (UTC+0)' },
  ];

  const languages = [
    { value: 'zh-TW', label: '繁體中文' },
    { value: 'zh-CN', label: '簡體中文' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
  ];

  const dateFormats = [
    { value: 'Y-m-d', label: '2024-01-01' },
    { value: 'd/m/Y', label: '01/01/2024' },
    { value: 'm/d/Y', label: '01/01/2024' },
    { value: 'd-m-Y', label: '01-01-2024' },
  ];

  const timeFormats = [
    { value: 'H:i', label: '24 小時制 (14:30)' },
    { value: 'h:i A', label: '12 小時制 (2:30 PM)' },
  ];

  const currencies = [
    { value: 'TWD', label: '新台幣 (TWD)' },
    { value: 'USD', label: '美元 (USD)' },
    { value: 'EUR', label: '歐元 (EUR)' },
    { value: 'JPY', label: '日圓 (JPY)' },
  ];

  return (
    <AppLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            組織設定
          </h2>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">{organization.name}</span>
          </div>
        </div>
      }
    >
      <Head title="組織設定" />

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
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">基本設定</TabsTrigger>
                <TabsTrigger value="notifications">通知設定</TabsTrigger>
                <TabsTrigger value="security">安全設定</TabsTrigger>
                <TabsTrigger value="appearance">外觀設定</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>基本設定</CardTitle>
                    <CardDescription>
                      設定組織的基本資訊和系統偏好
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">時區</Label>
                        <Select
                          value={data.timezone}
                          onValueChange={(value) => setData('timezone', value)}
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
                        {errors.timezone && (
                          <p className="text-sm text-red-600">{errors.timezone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">語言</Label>
                        <Select
                          value={data.language}
                          onValueChange={(value) => setData('language', value)}
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
                        {errors.language && (
                          <p className="text-sm text-red-600">{errors.language}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date_format">日期格式</Label>
                        <Select
                          value={data.date_format}
                          onValueChange={(value) => setData('date_format', value)}
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
                        {errors.date_format && (
                          <p className="text-sm text-red-600">{errors.date_format}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="time_format">時間格式</Label>
                        <Select
                          value={data.time_format}
                          onValueChange={(value) => setData('time_format', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇時間格式" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeFormats.map((format) => (
                              <SelectItem key={format.value} value={format.value}>
                                {format.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.time_format && (
                          <p className="text-sm text-red-600">{errors.time_format}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">貨幣</Label>
                        <Select
                          value={data.currency}
                          onValueChange={(value) => setData('currency', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇貨幣" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencies.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.currency && (
                          <p className="text-sm text-red-600">{errors.currency}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>通知設定</CardTitle>
                    <CardDescription>
                      設定組織的通知偏好
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email_notifications">電子郵件通知</Label>
                          <p className="text-sm text-gray-500">
                            接收系統相關的電子郵件通知
                          </p>
                        </div>
                        <Switch
                          id="email_notifications"
                          checked={data.notifications.email_notifications}
                          onCheckedChange={(checked) =>
                            setData('notifications', {
                              ...data.notifications,
                              email_notifications: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="system_notifications">系統通知</Label>
                          <p className="text-sm text-gray-500">
                            接收系統更新和維護通知
                          </p>
                        </div>
                        <Switch
                          id="system_notifications"
                          checked={data.notifications.system_notifications}
                          onCheckedChange={(checked) =>
                            setData('notifications', {
                              ...data.notifications,
                              system_notifications: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="security_notifications">安全通知</Label>
                          <p className="text-sm text-gray-500">
                            接收安全相關的重要通知
                          </p>
                        </div>
                        <Switch
                          id="security_notifications"
                          checked={data.notifications.security_notifications}
                          onCheckedChange={(checked) =>
                            setData('notifications', {
                              ...data.notifications,
                              security_notifications: checked,
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
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="min_length">密碼最小長度</Label>
                        <Input
                          id="min_length"
                          type="number"
                          min="6"
                          max="32"
                          value={data.security.password_policy.min_length}
                          onChange={(e) =>
                            setData('security', {
                              ...data.security,
                              password_policy: {
                                ...data.security.password_policy,
                                min_length: parseInt(e.target.value),
                              },
                            })
                          }
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="require_uppercase">要求大寫字母</Label>
                            <p className="text-sm text-gray-500">
                              密碼必須包含至少一個大寫字母
                            </p>
                          </div>
                          <Switch
                            id="require_uppercase"
                            checked={data.security.password_policy.require_uppercase}
                            onCheckedChange={(checked) =>
                              setData('security', {
                                ...data.security,
                                password_policy: {
                                  ...data.security.password_policy,
                                  require_uppercase: checked,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="require_lowercase">要求小寫字母</Label>
                            <p className="text-sm text-gray-500">
                              密碼必須包含至少一個小寫字母
                            </p>
                          </div>
                          <Switch
                            id="require_lowercase"
                            checked={data.security.password_policy.require_lowercase}
                            onCheckedChange={(checked) =>
                              setData('security', {
                                ...data.security,
                                password_policy: {
                                  ...data.security.password_policy,
                                  require_lowercase: checked,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="require_numbers">要求數字</Label>
                            <p className="text-sm text-gray-500">
                              密碼必須包含至少一個數字
                            </p>
                          </div>
                          <Switch
                            id="require_numbers"
                            checked={data.security.password_policy.require_numbers}
                            onCheckedChange={(checked) =>
                              setData('security', {
                                ...data.security,
                                password_policy: {
                                  ...data.security.password_policy,
                                  require_numbers: checked,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="require_symbols">要求特殊符號</Label>
                            <p className="text-sm text-gray-500">
                              密碼必須包含至少一個特殊符號
                            </p>
                          </div>
                          <Switch
                            id="require_symbols"
                            checked={data.security.password_policy.require_symbols}
                            onCheckedChange={(checked) =>
                              setData('security', {
                                ...data.security,
                                password_policy: {
                                  ...data.security.password_policy,
                                  require_symbols: checked,
                                },
                              })
                            }
                          />
                        </div>
                      </div>

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

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two_factor_required">強制雙重驗證</Label>
                          <p className="text-sm text-gray-500">
                            要求所有用戶啟用雙重驗證
                          </p>
                        </div>
                        <Switch
                          id="two_factor_required"
                          checked={data.security.two_factor_required}
                          onCheckedChange={(checked) =>
                            setData('security', {
                              ...data.security,
                              two_factor_required: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2" />
                      外觀設定
                    </CardTitle>
                    <CardDescription>
                      自訂組織的外觀和主題
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="theme">主題</Label>
                        <Select
                          value={data.appearance.theme}
                          onValueChange={(value) =>
                            setData('appearance', {
                              ...data.appearance,
                              theme: value as 'light' | 'dark' | 'auto',
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="選擇主題" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">淺色主題</SelectItem>
                            <SelectItem value="dark">深色主題</SelectItem>
                            <SelectItem value="auto">自動 (跟隨系統)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="primary_color">主要顏色</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="primary_color"
                            type="color"
                            value={data.appearance.primary_color}
                            onChange={(e) =>
                              setData('appearance', {
                                ...data.appearance,
                                primary_color: e.target.value,
                              })
                            }
                            className="w-16 h-10"
                          />
                          <Input
                            value={data.appearance.primary_color}
                            onChange={(e) =>
                              setData('appearance', {
                                ...data.appearance,
                                primary_color: e.target.value,
                              })
                            }
                            placeholder="#3b82f6"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="logo_url">Logo URL</Label>
                        <Input
                          id="logo_url"
                          type="url"
                          value={data.appearance.logo_url}
                          onChange={(e) =>
                            setData('appearance', {
                              ...data.appearance,
                              logo_url: e.target.value,
                            })
                          }
                          placeholder="https://example.com/logo.png"
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

export default OrganizationSettings;
