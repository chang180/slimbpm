import React, { useState } from 'react';
import { SafeSelect, SafeSelectItem } from '@/components/ui/safe-select';

/**
 * 安全 Select 組件使用示例
 * 展示如何避免 Radix UI 空字符串錯誤
 */
export function SafeSelectExample() {
  const [organizationId, setOrganizationId] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  const organizations = [
    { id: '1', name: '組織 A' },
    { id: '2', name: '組織 B' },
  ];

  const handleSubmit = () => {
    // 提交時，空字符串會自動保持為空字符串
    console.log({
      organizationId, // 可能是 "" 或 "1" 或 "2"
      role,          // 可能是 "" 或 "admin" 或 "user"
      status,         // 可能是 "" 或 "active" 或 "inactive"
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label>組織</label>
        <SafeSelect
          value={organizationId}
          onValueChange={setOrganizationId}
          placeholder="選擇組織"
        >
          <SafeSelectItem value="">無</SafeSelectItem>
          {organizations.map((org) => (
            <SafeSelectItem key={org.id} value={org.id}>
              {org.name}
            </SafeSelectItem>
          ))}
        </SafeSelect>
      </div>

      <div>
        <label>角色</label>
        <SafeSelect
          value={role}
          onValueChange={setRole}
          placeholder="選擇角色"
        >
          <SafeSelectItem value="">全部角色</SafeSelectItem>
          <SafeSelectItem value="admin">管理員</SafeSelectItem>
          <SafeSelectItem value="user">用戶</SafeSelectItem>
        </SafeSelect>
      </div>

      <div>
        <label>狀態</label>
        <SafeSelect
          value={status}
          onValueChange={setStatus}
          placeholder="選擇狀態"
        >
          <SafeSelectItem value="">全部狀態</SafeSelectItem>
          <SafeSelectItem value="active">啟用</SafeSelectItem>
          <SafeSelectItem value="inactive">停用</SafeSelectItem>
        </SafeSelect>
      </div>

      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}
