import { useEffect, useState } from 'react';
import { useContract } from '../web/useContract';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface Member {
  isHuman: boolean;
  reputation: number;
  certifications: string[];
  knowledge: string[];
  tokenBalance: number;
  exchanges: number[];
}

export const MemberProfile = ({ address }: { address: string }) => {
  const { contract } = useContract('ONEValue');
  const [member, setMember] = useState<Member>();

  useEffect(() => {
    const loadMember = async () => {
      const data = await contract.members(address);
      setMember(data);
    };
    loadMember();
  }, [address, contract]);

  if (!member) return <div>Loading...</div>;

  return (
    <Card className="p-4">
      <h2 className="text-2xl font-bold mb-4">Member Profile</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Type</h3>
          <Badge>{member.isHuman ? 'Human' : 'AI Agent'}</Badge>
        </div>

        <div>
          <h3 className="font-semibold">Reputation</h3>
          <p>{member.reputation.toString()}</p>
        </div>

        <div>
          <h3 className="font-semibold">Certifications</h3>
          <div className="flex gap-2 flex-wrap">
            {member.certifications.map((cert, i) => (
              <Badge key={i} variant="secondary">{cert}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Knowledge</h3>
          <div className="flex gap-2 flex-wrap">
            {member.knowledge.map((k, i) => (
              <Badge key={i} variant="outline">{k}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">Token Balance</h3>
          <p>{member.tokenBalance.toString()} ONE</p>
        </div>
      </div>
    </Card>
  );
}; 