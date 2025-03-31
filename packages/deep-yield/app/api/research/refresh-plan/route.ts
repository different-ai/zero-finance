import { NextResponse } from 'next/server';
import { auth } from '../../../(auth)/auth';
import { PlanStateManager } from '../../../../lib/ai/tools/plan-yield-research';

export async function GET() {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return new NextResponse(JSON.stringify({ success: false, message: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Get the current plan from state manager
    const stateManager = PlanStateManager.getInstance();
    const currentPlan = stateManager.getCurrentPlan();
    
    if (!currentPlan) {
      return new NextResponse(JSON.stringify({ 
        success: false, 
        message: 'No research plan exists. Create one first.' 
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Return the plan
    return new NextResponse(JSON.stringify({
      success: true,
      plan: currentPlan,
      message: `Retrieved research plan: "${currentPlan.title}"`
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    console.error('Error refreshing research plan:', error);
    return new NextResponse(JSON.stringify({ 
      success: false, 
      message: 'An error occurred while refreshing the research plan.' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
} 