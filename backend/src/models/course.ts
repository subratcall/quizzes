import {
  BaseEntity,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm"
import { Language } from "./language"
import { Organization } from "./organization"

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") public id: string

  @ManyToOne(type => Organization, org => org.id)
  public organization: Organization

  @ManyToMany(type => Language, lang => lang.id)
  @JoinTable({ name: "course_language" })
  public languages: Language[]
}
