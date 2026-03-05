export type MemberId =
  // Technical
  | 'claude' | 'gpt' | 'gemini' | 'grok'
  | 'perplexity' | 'deepseek' | 'kimi' | 'qwen'
  | 'cetico' | 'visionario' | 'pragmatico' | 'popular'
  | 'psicologo' | 'historiador' | 'leigo'
  // Historical
  | 'socrates' | 'maquiavel' | 'suntzu' | 'marcoaurelio'
  | 'nietzsche' | 'buda' | 'jung' | 'davinci'
  | 'jobs' | 'buffett' | 'tolle' | 'taleb'
  | 'lemann' | 'einstein'

export type Phase = 'opinions' | 'debate' | 'replica' | 'treplica' | 'verdict'

export type MemberStatus = 'pending' | 'active' | 'done' | 'skipped'

export interface Member {
  id: MemberId
  name: string
  model: string
  role: string
  color: string
  symbol: string
  category: 'technical' | 'historical'
  subcategory: 'models' | 'specialists' | 'minds'
  description: string
  whenToCall: string
  systemPrompt: string
  era?: string
  poweredBy?: string
}

export interface CouncilSession {
  question: string
  selectedMembers: MemberId[]
  rounds: Partial<Record<Phase, Record<MemberId, string>>>
}

export interface ApiRequest {
  question: string
  memberId?: MemberId
  selectedMembers: MemberId[]
  previousRounds?: Partial<Record<string, Record<string, string>>>
  speed?: 'fast' | 'normal' | 'deep'
}

export interface ApiResponse {
  results: Array<{ memberId: MemberId; text: string; phase: Phase }>
}

export interface UtilityRequest {
  action: 'convergence' | 'mostDivergent' | 'electPresident'
  question: string
  selectedMembers: MemberId[]
  previousRounds: Partial<Record<string, Record<string, string>>>
}

export interface UtilityResponse {
  text: string
}
