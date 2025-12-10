// ==========================================
// 📌 LINE SDK Utilities
// ==========================================

import { Client, type TextMessage, type FlexMessage } from '@line/bot-sdk';

// LINE Bot Client (Lazy initialization to avoid build errors)
let _lineClient: Client | null = null;

function getLineClient(): Client {
  if (!_lineClient) {
    const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const channelSecret = process.env.LINE_CHANNEL_SECRET;
    
    if (!channelAccessToken || !channelSecret) {
      // Return a dummy client for build time
      console.warn('[LINE] Missing credentials, using dummy client');
      return {
        pushMessage: async () => ({ sentMessages: [] }),
        replyMessage: async () => ({ sentMessages: [] }),
      } as unknown as Client;
    }
    
    _lineClient = new Client({
      channelAccessToken,
      channelSecret,
    });
  }
  return _lineClient;
}

// Export getter instead of direct client
export const lineClient = {
  pushMessage: async (...args: Parameters<Client['pushMessage']>) => {
    return getLineClient().pushMessage(...args);
  },
  replyMessage: async (...args: Parameters<Client['replyMessage']>) => {
    return getLineClient().replyMessage(...args);
  },
};

// ----- Message Templates -----

/**
 * Send booking confirmation message
 */
export async function sendBookingConfirmation(
  lineUserId: string,
  booking: {
    date: string;
    startTime: string;
    endTime: string;
    problemType?: string;
  }
) {
  const message: FlexMessage = {
    type: 'flex',
    altText: '✅ ยืนยันการจองเรียบร้อย',
    contents: {
      type: 'bubble',
      size: 'kilo',
      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#4ECDC4',
        paddingAll: '20px',
        contents: [
          {
            type: 'text',
            text: '✅ จองคิวสำเร็จ',
            color: '#FFFFFF',
            weight: 'bold',
            size: 'lg',
          },
        ],
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: '📅 วันที่', size: 'sm', color: '#888888', flex: 1 },
              { type: 'text', text: booking.date, size: 'sm', weight: 'bold', flex: 2 },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: '🕐 เวลา', size: 'sm', color: '#888888', flex: 1 },
              { type: 'text', text: `${booking.startTime} - ${booking.endTime}`, size: 'sm', weight: 'bold', flex: 2 },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              { type: 'text', text: '📝 ประเภท', size: 'sm', color: '#888888', flex: 1 },
              { type: 'text', text: booking.problemType || '-', size: 'sm', flex: 2 },
            ],
          },
          { type: 'separator', margin: 'md' },
          {
            type: 'text',
            text: 'กรุณามาก่อนเวลานัด 10 นาที',
            size: 'xs',
            color: '#888888',
            margin: 'md',
          },
        ],
      },
    },
  };

  try {
    await lineClient.pushMessage(lineUserId, message);
    return { success: true };
  } catch (error) {
    console.error('LINE push message error:', error);
    return { success: false, error };
  }
}

/**
 * Send consultant assignment notification
 */
export async function sendAssignmentNotification(
  lineUserId: string,
  consultantName: string
) {
  const message: TextMessage = {
    type: 'text',
    text: `👨‍⚕️ คิวของคุณได้รับมอบหมายให้ ${consultantName} แล้ว\n\nกรุณามาตามเวลานัดหมายครับ/ค่ะ`,
  };

  try {
    await lineClient.pushMessage(lineUserId, message);
    return { success: true };
  } catch (error) {
    console.error('LINE push message error:', error);
    return { success: false, error };
  }
}

/**
 * Send booking reminder
 */
export async function sendBookingReminder(
  lineUserId: string,
  booking: {
    date: string;
    startTime: string;
  }
) {
  const message: TextMessage = {
    type: 'text',
    text: `⏰ แจ้งเตือน: คุณมีนัดวันนี้\n\n📅 วันที่: ${booking.date}\n🕐 เวลา: ${booking.startTime} น.\n\nกรุณามาก่อนเวลานัด 10 นาทีครับ/ค่ะ`,
  };

  try {
    await lineClient.pushMessage(lineUserId, message);
    return { success: true };
  } catch (error) {
    console.error('LINE push message error:', error);
    return { success: false, error };
  }
}

/**
 * Send cancellation notification
 */
export async function sendCancellationNotification(
  lineUserId: string,
  reason?: string
) {
  const message: TextMessage = {
    type: 'text',
    text: `❌ การจองของคุณถูกยกเลิก${reason ? `\n\nเหตุผล: ${reason}` : ''}\n\nหากต้องการจองใหม่ กรุณาเข้าระบบจองคิวอีกครั้ง`,
  };

  try {
    await lineClient.pushMessage(lineUserId, message);
    return { success: true };
  } catch (error) {
    console.error('LINE push message error:', error);
    return { success: false, error };
  }
}