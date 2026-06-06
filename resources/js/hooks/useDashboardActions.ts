import { router } from '@inertiajs/react';
import { useCallback } from 'react';
import apiInvitations from '@/routes/api/invitations';
import invitationsRoutes from '@/routes/invitations';
import workflowsRoutes from '@/routes/workflows';

export function useDashboardActions() {
    const onSendInvitation = useCallback(
        (data: { emails: string[]; role: string; message?: string }) => {
            router.post(apiInvitations.store.url(), data, {
                onSuccess: () => router.reload({ only: ['invitations', 'stats'] }),
                onError: (errors) => console.error('發送邀請失敗:', errors),
            });
        },
        [],
    );

    const onResendInvitation = useCallback((id: string) => {
        router.post(
            apiInvitations.resend.url(Number(id)),
            {},
            {
                onSuccess: () => router.reload({ only: ['invitations'] }),
                onError: (errors) => console.error('重新發送邀請失敗:', errors),
            },
        );
    }, []);

    const onCancelInvitation = useCallback((id: string) => {
        router.delete(apiInvitations.destroy.url(Number(id)), {
            onSuccess: () => router.reload({ only: ['invitations', 'stats'] }),
            onError: (errors) => console.error('取消邀請失敗:', errors),
        });
    }, []);

    const onStartWorkflow = useCallback((_templateId: string) => {
        router.visit(workflowsRoutes.start.url());
    }, []);

    const onViewWorkflow = useCallback((instanceId: string) => {
        router.visit(workflowsRoutes.show.url(Number(instanceId)));
    }, []);

    const onEditWorkflow = useCallback((instanceId: string) => {
        router.visit(workflowsRoutes.show.url(Number(instanceId)));
    }, []);

    const onApproveWorkflow = useCallback((instanceId: string) => {
        router.visit(workflowsRoutes.show.url(Number(instanceId)));
    }, []);

    const onRejectWorkflow = useCallback((instanceId: string) => {
        router.visit(workflowsRoutes.show.url(Number(instanceId)));
    }, []);

    const onInviteMembers = useCallback(() => {
        router.visit(invitationsRoutes.index.url());
    }, []);

    const onSendBulkInvites = useCallback(() => {
        router.visit(invitationsRoutes.index.url());
    }, []);

    return {
        onSendInvitation,
        onResendInvitation,
        onCancelInvitation,
        onStartWorkflow,
        onViewWorkflow,
        onEditWorkflow,
        onApproveWorkflow,
        onRejectWorkflow,
        onInviteMembers,
        onSendBulkInvites,
    };
}
