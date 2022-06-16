import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import Application from '@ioc:Adonis/Core/Application'

export default class StudentsController {
  public async getAll({ response }: HttpContextContract) {
    const students = await Database.from('students').select('*');

    return response.json(students);
  }

  public async create({ request, response }: HttpContextContract) {
    let data = request.body()
    const image = request.file('image')

    if (image) {
      await image.move(Application.tmpPath('images'), {
        name: `user-${Date.now()}`,
        overwrite: true,
      })
    }

    data = {
      ...data,
      password: await Hash.use('bcrypt').make(data.password),
      'image_path': image?.fileName,
    }

    const studentId = await Database
      .insertQuery()
      .table('students')
      .insert(data)
      .returning('id')

    return response.status(201).json(studentId)
  }

  public async getOne({ params, response }: HttpContextContract) {
    const studentId = params.id;

    if (!studentId) {
      return response.status(403).json({
        message: 'ID inválido',
      })
    }

    const student = await Database
      .from('students')
      .where('id', studentId)
      .select('*')
      .first()

    return response.json(student)
  }
}
