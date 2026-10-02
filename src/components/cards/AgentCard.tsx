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
    <div className="agent-card">
      <div className="w-full">
        {/* Avatar with initials */}
        <div className={`agent-avatar mx-auto ${gradient}`}>
          {initials}
        </div>

        {/* Name & Cyan Role */}
        <h3 className="agent-name">{agent.name}</h3>
        <p className="agent-role">{agent.role}</p>

        {/* Bio */}
        <p className="agent-bio">
          {agent.description}
        </p>
      </div>

      <div className="w-full">
        {/* Stats Row */}
        <div className="agent-stats">
          <div>
            <div className="agent-stat-val">{agent.deals_count}+</div>
            <div className="agent-stat-lbl">
              {agent.name === 'Amit Kumar' ? 'Verified' : 'Deals'}
            </div>
          </div>
          <div>
            <div className="agent-stat-val flex items-center justify-center gap-1">
              {agent.rating}
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
            </div>
            <div className="agent-stat-lbl">Rating</div>
          </div>
          <div>
            <div className="agent-stat-val">{agent.experience_years}</div>
            <div className="agent-stat-lbl">Yrs</div>
          </div>
        </div>

        {/* Contact Action Buttons (Phone, Email, WhatsApp) */}
        <div className="agent-actions">
          <a
            href={`tel:${agent.phone || '+916398987290'}`}
            className="agent-act-btn text-[#EC4899]"
            title="Call"
            aria-label={`Call ${agent.name}`}
          >
            <Phone size={15} />
          </a>
          <a
            href={`mailto:${agent.email || 'pathak424448@gmail.com'}`}
            className="agent-act-btn text-text-secondary"
            title="Email"
            aria-label={`Email ${agent.name}`}
          >
            <Mail size={15} />
          </a>
          <a
            href={`https://wa.me/91${(agent.phone || '6398987290').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="agent-act-btn text-[#25D366]"
            title="WhatsApp"
            aria-label={`WhatsApp ${agent.name}`}
          >
            <MessageSquare size={15} />
          </a>
        </div>
      </div>
    </div>
  )
}
