interface DamageRelations {
  double_damage_from: { name: string; url: string }[]
  double_damage_to: { name: string; url: string }[]
  half_damage_from: { name: string; url: string }[]
  half_damage_to: { name: string; url: string }[]
  no_damage_from: { name: string; url: string }[]
  no_damage_to: { name: string; url: string }[]
}

export interface TypeDetail {
  id: number
  name: string
  damage_relations: DamageRelations
}
