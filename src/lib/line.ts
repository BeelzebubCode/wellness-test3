// ==========================================
// 📌 LINE SDK Utilities
// ==========================================

import { Client, type TextMessage, type FlexMessage } from '@line/bot-sdk';

// LINE Bot Client (Server-side only)
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

export const lineClient = new Client(lineConfig);

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
