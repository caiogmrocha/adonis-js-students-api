import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import Application from '@ioc:Adonis/Core/Application'

export default class StudentsController {
  public async getAll({ response }: HttpContextContract) {
    const students = await Database.from('students').select('*');

    return response.json(students);
  }
}
