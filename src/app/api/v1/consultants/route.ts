// ==========================================
// 📌 API Route: /api/v1/consultants
// รองรับทั้ง Mock Data และ Database จริง
// ==========================================

import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CONFIG, generateMockConsultants, simulateApiDelay } from '@/lib/mockData';

// ======================================
// GET /api/v1/consultants
// ======================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    // ========== MOCK MODE ==========
    if (MOCK_CONFIG.enabled) {
      await simulateApiDelay();
      
      let consultants = generateMockConsultants();
      
      // Filter only active if not showAll
      if (!showAll) {
        consultants = consultants.filter(c => c.isActive);
      }
      
      return NextResponse.json({ 
        success: true, 
        consultants,
        _mock: true 
      });
    }

    // ========== REAL DATABASE MODE ==========
    const { consultantService } = await import('@/services');
    const consultants = await consultantService.getAllConsultants(!showAll);
    return NextResponse.json({ success: true, consultants });
    
  } catch (error) {
    console.error('Error fetching consultants:', error);
    
    // Fallback to mock data
    const consultants = generateMockConsultants();
    return NextResponse.json({ 
      success: true, 
      consultants,
      _mock: true,
      _error: 'Database unavailable'
    });
  }
}

// ======================================
// POST /api/v1/consultants
// ======================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // ========== MOCK MODE ==========
    if (MOCK_CONFIG.enabled) {
      await simulateApiDelay();
      
      const mockConsultant = {
        id: `consultant-${Date.now()}`,
        name: body.name,
        email: body.email || null,
        phone: body.phone || null,
        specialty: body.specialty || null,
        avatar: body.avatar || null,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return NextResponse.json({ 
        success: true, 
        consultant: mockConsultant,
        _mock: true 
      });
    }

    // ========== REAL DATABASE MODE ==========
    const { consultantService } = await import('@/services');
    
    const consultant = await consultantService.createConsultant({
      name: body.name,
      email: body.email,
      phone: body.phone,
      avatar: body.avatar,
      specialty: body.specialty,
    });

    return NextResponse.json({ success: true, consultant });
    
  } catch (error) {
    console.error('Error creating consultant:', error);
    return NextResponse.json({ error: 'Failed to create consultant' }, { status: 500 });
  }
}