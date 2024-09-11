'use client'

import { MemberItem } from '../../scout-group/members/member-item'
import { Member } from '../../scout-group/members/members-table'

export function MItem({ member }: { member: Member }) {
  return <MemberItem member={member} refetch={() => {}} isSubmitted={true} />
}
