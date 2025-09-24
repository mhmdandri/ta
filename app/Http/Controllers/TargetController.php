<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\SpvTarget;
use App\Models\ManagerTarget;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Routing\Controller as BaseController;

class TargetController extends BaseController
{
    public function __construct()
    {
        // Semua butuh auth & verified
        $this->middleware(['auth', 'verified']);

        $this->middleware(['role:admin|manager|gm|spv'])->only(['edit', 'update', 'index', 'create', 'store']);
        $this->middleware(['role:admin|manager|gm'])->only(['destroy']);
    }
    /**
     * Display the target management page
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $currentPeriod = $request->get('period', now()->format('Y-m'));
        $periodDate = Carbon::createFromFormat('Y-m', $currentPeriod)->startOfMonth();

        $data = [
            'currentPeriod' => $currentPeriod,
            'user' => $user,
        ];

        if ($user->role === 'gm') {
            $managerId = $request->integer('manager_id') ?: null;
            $data['managers'] = User::where('role', 'manager')->get(['id', 'name', 'email']);
            if ($managerId) {
                $data['spvs'] = $this->getSpvsWithTargetsAndSales($managerId, $periodDate);
                $data['managerTarget'] = $this->getManagerTarget($managerId, $periodDate);
                $data['selectedManagerId'] = $managerId;
            }
            return Inertia::render('targets/index', $data);
        } else if ($user->role === 'manager') {
            // Manager dapat melihat semua SPV dan sales di bawahnya
            $data['spvs'] = $this->getSpvsWithTargetsAndSales($user->id, $periodDate);
            $data['managerTarget'] = $this->getManagerTarget($user->id, $periodDate);
        } elseif ($user->role === 'spv') {
            // SPV hanya dapat melihat sales di bawahnya
            $data['sales'] = $this->getSalesForSpv($user->id);
            $data['spvTarget'] = $this->getSpvTarget($user->id, $periodDate);
        }

        return Inertia::render('targets/index', $data);
    }

    /**
     * Get SPVs with their targets and sales for a manager
     */
    private function getSpvsWithTargetsAndSales($managerId, $periodDate)
    {
        return User::where('role', 'spv')
            ->where('manager_id', $managerId)
            ->with([
                'spvTargets' => function ($query) use ($periodDate) {
                    $query->where('period', $periodDate);
                },
                'subordinates' => function ($query) {
                    $query->where('role', 'sales')->select('id', 'name', 'email', 'target_sales', 'supervisor_id');
                }
            ])
            ->get()
            ->map(function ($spv) use ($periodDate) {
                $spvTarget = $spv->spvTargets->first();

                return [
                    'id' => $spv->id,
                    'name' => $spv->name,
                    'email' => $spv->email,
                    'target_amount' => $spvTarget ? $spvTarget->target_amount : 0,
                    'target_id' => $spvTarget ? $spvTarget->id : null,
                    'sales' => $spv->subordinates->map(function ($sales) {
                        return [
                            'id' => $sales->id,
                            'name' => $sales->name,
                            'email' => $sales->email,
                            'target_sales' => $sales->target_sales ?? 0,
                        ];
                    })
                ];
            });
    }

    /**
     * Get sales for a specific SPV
     */
    private function getSalesForSpv($spvId)
    {
        return User::where('role', 'sales')
            ->where('supervisor_id', $spvId)
            ->select('id', 'name', 'email', 'target_sales')
            ->get();
    }

    /**
     * Get manager target for specific period
     */
    private function getManagerTarget($managerId, $periodDate)
    {
        $target = ManagerTarget::where('manager_id', $managerId)
            ->where('period', $periodDate)
            ->first();

        return [
            'id' => $target ? $target->id : null,
            'target_amount' => $target ? $target->target_amount : 0,
        ];
    }

    /**
     * Get SPV target for specific period
     */
    private function getSpvTarget($spvId, $periodDate)
    {
        $target = SpvTarget::where('spv_id', $spvId)
            ->where('period', $periodDate)
            ->first();

        return [
            'id' => $target ? $target->id : null,
            'target_amount' => $target ? $target->target_amount : 0,
        ];
    }

    /**
     * Update manager target
     */
    public function updateManagerTarget(Request $request)
    {
        $request->validate([
            'period' => 'required|date_format:Y-m',
            'target_amount' => 'required|numeric|min:0',
            'manager_id' => 'nullable|exists:users,id',
        ]);

        $user = Auth::user();
        $periodDate = Carbon::createFromFormat('Y-m', $request->period)->startOfMonth();

        // if ($user->role !== 'manager') {
        //     return response()->json(['error' => 'Unauthorized'], 403);
        // }
        if ($user->role === 'gm') {
            $managerId = $request->manager_id;
            if (!$managerId) {
                return response()->json(['message' => 'Manager ID is required'], 400);
            }
        } else {
            if (!$user->role === 'manager') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
        }
        ManagerTarget::updateOrCreate(
            [
                'manager_id' => $managerId,
                'period' => $periodDate,
            ],
            [
                'target_amount' => $request->target_amount,
            ]
        );

        return response()->json(['error' => 'Manager target updated successfully']);
    }

    /**
     * Update SPV target (only manager can do this)
     */
    public function updateSpvTarget(Request $request)
    {
        $request->validate([
            'spv_id' => 'required|exists:users,id',
            'period' => 'required|date_format:Y-m',
            'target_amount' => 'required|numeric|min:0',
        ]);

        $user = Auth::user();
        $periodDate = Carbon::createFromFormat('Y-m', $request->period)->startOfMonth();
        $spv = User::where('id', $request->spv_id)->where('role', 'spv')->first();
        if (!$spv) {
            return response()->json(['error' => 'SPV not found'], 404);
        }
        if ($user->role === 'gm') {
            if ($user->role !== 'manager') {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            if ($spv->manager_id !== $user->id) {
                return response()->json(['error' => 'SPV not under your management'], 403);
            }
        }
        SpvTarget::updateOrCreate(
            [
                'spv_id' => $request->spv_id,
                'period' => $periodDate,
            ],
            [
                'target_amount' => $request->target_amount,
            ]
        );

        return response()->json(['message' => 'SPV target updated successfully']);
    }

    /**
     * Update sales target (Manager and SPV can do this)
     */
    public function updateSalesTarget(Request $request)
    {
        $request->validate([
            'sales_id' => 'required|exists:users,id',
            'target_sales' => 'required|numeric|min:0',
        ]);
        $user = Auth::user();
        $sales = User::where('id', $request->sales_id)->where('role', 'sales')->first();
        if (!$sales) {
            return response()->json(['error' => 'Sales not found'], 404);
        }
        if (!$user->role === 'gm') {
            if (!in_array($user->role, ['manager', 'spv'])) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }
            if ($user->role === 'spv' && $sales->supervisor_id !== $user->id) {
                return response()->json(['error' => 'Sales not under your supervision'], 403);
            }
            if ($user->role === 'manager') {
                $spv = User::find($sales->supervisor_id);
                if (!$spv || $spv->manager_id !== $user->id) {
                    return response()->json(['error' => 'Sales not under your management'], 403);
                }
            }
        }
        $sales->update([
            'target_sales' => $request->target_sales,
        ]);

        return response()->json(['message' => 'Sales target updated successfully']);
    }
}
