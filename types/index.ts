export type MemberId = "lucian"|"catalin"|"saitama"|"beleaua"|"liviu"|"vlad"|"cosmin"|"ioana"
export interface Member { id: MemberId; name: string; pin: string; emoji: string; role: "ceo"|"sales"|"dev"|"multimedia"|"setter"|"seo"|"emergency"; title: string; color: string }
export type CardType = "task"|"lead"
export type CardPriority = "high"|"medium"|"low"
export type KanbanCol = "todo"|"inProgress"|"done"
export interface KanbanCard { id: string; title: string; type: CardType; priority: CardPriority; column: KanbanCol; assigneeId?: MemberId|null; createdById: MemberId; createdAt: string }
export interface CallerScore { memberId: MemberId; leadsSetate: number; leadsSunate: number }
export type PaymentStatus = "pending"|"due"|"collected"|"overdue"
export interface Payment { id: string; clientName: string; amount: number; currency: string; dueDate: string; status: PaymentStatus; notes?: string; createdAt: string }
export interface BubbleMsg { memberId: MemberId; text: string; ts: number }
