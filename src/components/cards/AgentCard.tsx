import { Phone, Mail, MessageSquare, Star } from 'lucide-react'
import { Agent } from '@/types'

interface AgentCardProps {
  agent: Agent
}

const agentGradients: Record<string, string> = {
  'Abhishek Pathak': 'bg-gradient-to-br from-[#3B82F6] to-[#00C2D9]',
  'Piyush Pandey': 'bg-gradient-to-br from-[#F97316] to-[#EF4444]',
  'Akhil Kumar': 'bg-gradient-to-br from-[#0F766E] to-[#3B82F6]',
}

export default function AgentCard({ agent }: AgentCardProps) {
  const gradient = agentGradients[agent.name] || 'bg-gradient-to-br from-[#7C3AED] to-[#4C1D95]'
  const initials = agent.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
  const phone = agent.phone || '+91 9151435647'
  const email = agent.email || 'primehomekanpur@gmail.com'
  const rawPhone = phone.replace(/\D/g, '') || '919151435647'

  return (
    <div className="agent-card flex flex-col justify-between p-6 rounded-2xl border border-white/10 bg-[#0E0B1F] hover:border-primary/40 transition-all">
      <div className="w-full text-center">
        {/* Avatar with initials */}
        <div className={`agent-avatar mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg ${gradient}`}>
          {initials}
        </div>

        {/* Name & Role */}
        <h3 className="agent-name text-lg font-bold text-white tracking-tight">{agent.name}</h3>
        <p className="agent-role text-xs text-accent-cyan font-semibold mt-0.5 mb-3">
          {agent.designation || agent.role}
        </p>

        {/* Bio */}
        <p className="agent-bio text-xs text-text-secondary leading-relaxed line-clamp-3 mb-6">
          {agent.bio || agent.description}
        </p>
      </div>

      <div className="w-full space-y-4 pt-4 border-t border-white/5">
        {/* Contact Action Buttons (Call, Message, WhatsApp) */}
        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${phone}`}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/5 text-[#EC4899] text-[11px] font-semibold transition-all hover:scale-102"
            title="Call"
            aria-label={`Call ${agent.name}`}
          >
            <Phone size={14} className="mb-0.5" />
            <span>Call</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/5 text-text-secondary hover:text-white text-[11px] font-semibold transition-all hover:scale-102"
            title="Email"
            aria-label={`Email ${agent.name}`}
          >
            <Mail size={14} className="mb-0.5" />
            <span>Message</span>
          </a>

          <a
            href={`https://wa.me/${rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/5 text-[#25D366] text-[11px] font-semibold transition-all hover:scale-102"
            title="WhatsApp"
            aria-label={`WhatsApp ${agent.name}`}
          >
            <MessageSquare size={14} className="mb-0.5" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
