import Link from 'next/link'
import { Phone, Mail, MessageSquare, Star } from 'lucide-react'
import { Agent } from '@/types'

interface AgentCardProps {
  agent: Agent
}

const agentGradients: Record<string, string> = {
  'Rajesh Pathak': 'bg-gradient-to-br from-[#3B82F6] to-[#00C2D9]',
  'Shikha Pathak': 'bg-gradient-to-br from-[#F97316] to-[#EF4444]',
  'Amit Kumar': 'bg-gradient-to-br from-[#0F766E] to-[#3B82F6]',
  'Neha Mishra': 'bg-gradient-to-br from-[#8B5CF6] to-[#EC4899]',
  'Rahul Sharma': 'bg-gradient-to-br from-[#F97316] to-[#EF4444]',
  'Priya Tiwari': 'bg-gradient-to-br from-[#0F766E] to-[#3B82F6]',
}

export default function AgentCard({ agent }: AgentCardProps) {
  const gradient = agentGradients[agent.name] || 'bg-gradient-to-br from-[#7C3AED] to-[#4C1D95]'
  const initials = agent.name === 'Amit Kumar' ? 'AK' : agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  return (
    <div className="agent-card bg-surface border border-border rounded-2xl p-6 text-center flex flex-col justify-between">
      <div>
        {/* Avatar */}
        <div className={`w-20 h-20 rounded-full ${gradient} flex items-center justify-center mx-auto mb-4 text-white font-bold text-2xl shadow-lg border-2 border-white/10`}>
          {initials}
        </div>

        {/* Name & Role */}
        <h3 className="text-white font-bold text-lg mb-1">{agent.name}</h3>
        <p className="text-primary text-xs font-semibold uppercase tracking-wider mb-3">{agent.role}</p>

        {/* Description */}
        <p className="text-text-secondary text-xs leading-relaxed mb-4 min-h-[48px] line-clamp-3">
          {agent.description}
        </p>
      </div>

      <div>
        {/* Stats */}
        <div className="flex items-center justify-around py-3 border-y border-border/60 mb-4 text-center">
          <div>
            <span className="text-white font-bold text-sm block">{agent.deals_count}+</span>
            <span className="text-text-muted text-[11px] uppercase tracking-wider">
              {agent.name === 'Amit Kumar' ? 'Verified' : 'Deals'}
            </span>
          </div>
          <div className="h-5 w-px bg-border/60" />
          <div>
            <span className="text-white font-bold text-sm flex items-center justify-center gap-1">
              {agent.rating}
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
            </span>
            <span className="text-text-muted text-[11px] uppercase tracking-wider">Rating</span>
          </div>
          <div className="h-5 w-px bg-border/60" />
          <div>
            <span className="text-white font-bold text-sm block">{agent.experience_years}</span>
            <span className="text-text-muted text-[11px] uppercase tracking-wider">Yrs</span>
          </div>
        </div>

        {/* Contact Buttons (3 small rounded squares in a row) */}
        <div className="flex items-center justify-center gap-3">
          <a
            href={`tel:${agent.phone || '+916398987290'}`}
            className="icon-button w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent-pink hover:border-accent-pink hover:bg-accent-pink/10 transition-colors"
            title="Call"
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href={`mailto:${agent.email || 'pathak424448@gmail.com'}`}
            className="icon-button w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-text-secondary hover:border-violet hover:text-white transition-colors"
            title="Email"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href={`https://wa.me/91${(agent.phone || '6398987290').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="icon-button w-9 h-9 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-text-secondary hover:border-primary hover:text-primary transition-colors"
            title="WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}
