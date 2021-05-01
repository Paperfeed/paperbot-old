import {
  Message,
  MessageEmbed as OGMessageEmbed,
  StringResolvable,
} from 'discord.js'

export class MessageEmbed extends OGMessageEmbed {
  public editField = (
    name: StringResolvable,
    value: StringResolvable,
    inline?: boolean,
    messageToEdit?: Message,
  ): this => {
    const fieldIndex = this.fields.findIndex(f => f.name === name)

    if (fieldIndex === -1) {
      this.addField(name, value, inline)
    } else {
      this.fields = [
        ...this.fields.slice(0, fieldIndex),
        { inline, name, value },
        ...this.fields.slice(fieldIndex + 1, this.fields.length),
      ]
    }

    if (messageToEdit) {
      messageToEdit.edit(this)
    }

    return this
  }

  public removeField = (name: StringResolvable) => {
    this.fields = this.fields.filter(f => f.name !== name)
    return this
  }
}
