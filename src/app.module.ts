import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UserQueryRepository } from './features/users/repository/user.query-repository';
import { UserController } from './features/users/api/users.controller';
import { UserService } from './features/users/application/user.service';
import { BcryptService } from './infrastructure/adapters/bcrypt';
import { UserRepository } from './features/users/repository/user.repository';
// import { CommentController } from './features/comments/api/comment.controller';
// import { CommentQueryRepository } from './features/comments/repository/comment.query-repository';
// import { CommentRepository } from './features/comments/repository/comment.repository';
// import { CommentService } from './features/comments/application/comment.service';
// import { Comment, CommentSchema } from './features/comments/domain/comment.entity';
// import { Blog, BlogSchema } from './features/blogs/domain/blog.entity';
// import { BlogService } from './features/blogs/application/blog.service';
// import { BlogQueryRepository } from './features/blogs/repository/blog.query-repository';
// import { BlogRepository } from './features/blogs/repository/blog.repository';
// import { Post, PostSchema } from './features/posts/domain/post.entity';
// import { PostService } from './features/posts/application/post.service';
// import { PostRepository } from './features/posts/repository/post.repository';
// import { PostQueryRepository } from './features/posts/repository/post.query-repository';
// import { BlogController } from './features/blogs/api/blog.controller';
// import { PostController } from './features/posts/api/post.controller';
import { LoginIsExistConstraint } from './infrastructure/decorators/validate/login-is-exist.decorator';
import { EmailIsExistConstraint } from './infrastructure/decorators/validate/email-is-exist.decorator';
// import { AuthService } from './features/auth/application/auth.service';
// import { AuthController } from './features/auth/api/auth.controller';
// import { SessionController } from './features/sessions/api/session.controller';
// import { AuthRepository } from './features/auth/repository/auth.repository';
// import { AuthQueryRepository } from './features/auth/repository/auth.query-repository';
// import { SessionsService } from './features/sessions/application/session.service';
// import { SessionRepository } from './features/sessions/repository/session.repository';
// import { SessionsQueryRepository } from './features/sessions/repository/session.query-repository';
// import { Session, SessionSchema } from './features/sessions/domain/session.entity';
// import { ApiInfo, ApiSchema } from './features/auth/domain/auth.entity';
import { EmailService } from './infrastructure/adapters/sendEmail';
import { JwtService } from './infrastructure/adapters/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './infrastructure/pasport-strategy/local.strategy';
import { JwtStrategy } from './infrastructure/pasport-strategy/jwt.strategy';
import { LocalAuthGuard } from './infrastructure/guards/local-auth.guard';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { BasicStrategy } from './infrastructure/pasport-strategy/basic.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
// import { Like, LikesSchema } from './features/likes/domain/likes.entity';
// import { BlogIsExistConstraint } from './infrastructure/decorators/validate/blog-is-exist.decorator';
import { SoftAuthGuard } from './infrastructure/guards/dubl-guards/soft-auth.guard';
// import { CheckTokenAuthGuard } from './infrastructure/guards/dubl-guards/check-refresh-token.guard';
import configuration, { ConfigurationType } from './settings/configuration';
import { validate } from './settings/env/configuration-validation';
import { CreateUserUseCase } from './features/users/application/use-cases/create-user';
// import { UpdatePostLikeUseCase } from './features/posts/application/use-cases/update-post-like';
// import { LikeStatusUseCase } from './features/comments/application/use-cases/like-status';
// import { RegisterUserUseCase } from './features/auth/application/use-cases/register-user';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from './features/users/users.module';
// import { SessionsModule } from './features/sessions/sessions.module';
// import { AuthModule } from './features/auth/auth.module';
// import { CreateSessionUseCase } from './features/auth/application/use-cases/create-session';
// import { ResendEmailUseCase } from './features/auth/application/use-cases/resend-email';
// import { UpdateRefreshTokenUseCase } from './features/auth/application/use-cases/update-refresh-token';
// import { CreateCommentByPostUseCase } from './features/posts/application/use-cases/create-comment-by-post';
// import { CreatePostUseCase } from './features/posts/application/use-cases/create-post';
// import { NewPasswordUseCase } from './features/auth/application/use-cases/new-password';
// import { PasswordRecoveryUseCase } from './features/auth/application/use-cases/password-recovery';
// import { AuthLogoutAndDeleteSessionUseCase } from './features/auth/application/use-cases/auth-logout-and-delete-session';
// import { ConfirmEmailUseCase } from './features/auth/application/use-cases/confirm-email';
// import { CreatePostForBlogUseCase } from './features/blogs/application/use-cases/create-post-for-blog';
import { AdaptersModule } from './infrastructure/adapters/adapters.module';
// import { CoreModule } from './infrastructure/core.module';
import { TestingsModule } from './features/testing/testings.module';

const useCases = [
  CreateUserUseCase, 
  // LikeStatusUseCase, 
  // UpdatePostLikeUseCase,
  // RegisterUserUseCase, 
  // CreateSessionUseCase, 
  // ResendEmailUseCase, 
  // UpdateRefreshTokenUseCase,
  // CreateCommentByPostUseCase,
  // CreatePostUseCase,
  // NewPasswordUseCase,
  // PasswordRecoveryUseCase,
  // AuthLogoutAndDeleteSessionUseCase,
  // ConfirmEmailUseCase,
  // CreatePostForBlogUseCase
];
// const modules = [UsersModule, AuthModule, SessionsModule, AdaptersModule, CoreModule];// импортировать! 

@Module({
  imports: [
    CqrsModule,//-
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validate: validate,
      // ignoreEnvFile:
      // process.env.ENV !== Environments.DEVELOPMENT &&
      // process.env.ENV !== Environments.TEST,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'DK',// скрыть через useFactory???
      database: 'newDBforBloggersPlatform',
      autoLoadEntities: true,
      synchronize: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationType, true>) => {
        const environmentSettings = configService.get('environmentSettings', {infer: true,});
        const databaseSettings = configService.get('databaseSettings', {infer: true,});
        const uri = environmentSettings.isTesting // для тестов
          ? databaseSettings.MONGO_CONNECTION_URI_FOR_TESTS
          : databaseSettings.MONGO_CONNECTION_URI;
        // console.log(uri);
        return {uri: uri};
      },
      inject: [ConfigService],
    }),
    // MongooseModule.forRoot(SETTINGS.MONGO_URL),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },//-
      // { name: Comment.name, schema: CommentSchema },
      // { name: Blog.name, schema: BlogSchema },
      // { name: Post.name, schema: PostSchema },
      // { name: Session.name, schema: SessionSchema },//-
      // { name: ApiInfo.name, schema: ApiSchema },//-
      // { name: Like.name, schema: LikesSchema },
    ]),
    JwtModule.registerAsync({
      global: true,
      useFactory:(configService: ConfigService<ConfigurationType, true>) => {
        const secret = configService.get('jwtSecretSettings.JWT_SECRET_KEY', {infer: true,});// несоответствие типов !!!
        // console.log(secret, " secret")
        return {secret};
      },
      inject:[ConfigService]
    }),
    ThrottlerModule.forRoot([{
      ttl: 10000,
      limit: 5,
    }]),
    PassportModule,
    // ...modules
    TestingsModule
  ],
  controllers: [
    AppController,
    UserController,//-
    // CommentController,
    // BlogController,
    // PostController,
    // AuthController,//-
    // SessionController//-
  ],
  providers: [
    // {
    //   provide: Types.IUserService,
    //   useClass: UserService
    // },
    AppService,
    LocalStrategy, JwtStrategy, BasicStrategy, SoftAuthGuard,/* CheckTokenAuthGuard,*///-
    LoginIsExistConstraint, EmailIsExistConstraint,/* BlogIsExistConstraint,*/
    UserService, UserQueryRepository, UserRepository,//-
    BcryptService, EmailService, JwtService,//-
    // CommentService, CommentQueryRepository, CommentRepository,
    // BlogService, BlogRepository, BlogQueryRepository,
    // PostService, PostRepository, PostQueryRepository,
    // AuthService, AuthRepository, AuthQueryRepository,//-
    // SessionsService, SessionRepository, SessionsQueryRepository,//-
    ...useCases
  ]
})
export class AppModule {}