import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entities/user.entity';
import * as bcrypt from "bcrypt"
@EntityRepository(User)
export class UserRepository extends Repository<User> {

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto

        const user = new User()
        user.username = username
        user.salt = await bcrypt.genSalt()
        user.password = await this.hashPassword(password, user.salt)

        try {
            await user.save()
        } catch (err) {
            if (err.code === "23505") {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto
        const user = await this.findOne({ username })


        return user && await user.validateUserPassword(password) ? user.username :null
    }
    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt)
    }
}