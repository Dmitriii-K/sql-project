import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { EmailIsExistConstraint } from './infrastructure/decorators/validate/email-is-exist.decorator';;
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
// import { Like, LikesSchema } from './features/likes/domain/likes.entity';
// import { BlogIsExistConstraint } from './infrastructure/decorators/validate/blog-is-exist.decorator';
import configuration, { ConfigurationType } from './settings/configuration';
import { validate } from './settings/env/configuration-validation';
// import { UpdatePostLikeUseCase } from './features/posts/application/use-cases/update-post-like';
// import { LikeStatusUseCase } from './features/comments/application/use-cases/like-status';
// import { CreateCommentByPostUseCase } from './features/posts/application/use-cases/create-comment-by-post';
// import { CreatePostUseCase } from './features/posts/application/use-cases/create-post';
// import { CreatePostForBlogUseCase } from './features/blogs/application/use-cases/create-post-for-blog';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersModule } from './features/users/users.module';
import { SessionsModule } from './features/sessions/sessions.module';
import { AuthModule } from './features/auth/auth.module';
import { CreateUserUseCase } from './features/users/application/use-cases/create-user';
import { RegisterUserUseCase } from './features/auth/application/use-cases/register-user';
import { CreateSessionUseCase } from './features/auth/application/use-cases/create-session';
import { ResendEmailUseCase } from './features/auth/application/use-cases/resend-email';
import { UpdateRefreshTokenUseCase } from './features/auth/application/use-cases/update-refresh-token';
import { NewPasswordUseCase } from './features/auth/application/use-cases/new-password';
import { PasswordRecoveryUseCase } from './features/auth/application/use-cases/password-recovery';
import { AuthLogoutAndDeleteSessionUseCase } from './features/auth/application/use-cases/auth-logout-and-delete-session';
import { ConfirmEmailUseCase } from './features/auth/application/use-cases/confirm-email';
import { AdaptersModule } from './infrastructure/adapters/adapters.module';
import { CoreModule } from './infrastructure/core.module';
import { TestingsModule } from './features/testing/testings.module';

const useCases = [
  CreateUserUseCase, 
  RegisterUserUseCase, 
  CreateSessionUseCase, 
  ResendEmailUseCase, 
  UpdateRefreshTokenUseCase,
  NewPasswordUseCase,
  PasswordRecoveryUseCase,
  AuthLogoutAndDeleteSessionUseCase,
  ConfirmEmailUseCase,
  // LikeStatusUseCase, 
  // UpdatePostLikeUseCase,
  // CreateCommentByPostUseCase,
  // CreatePostUseCase,
  // CreatePostForBlogUseCase
];
const modules = [TestingsModule, UsersModule, AuthModule, SessionsModule, AdaptersModule, CoreModule];// импортировать! 

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
    TypeOrmModule.forRootAsync(
      {
        useFactory: () => {
          return {
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'dk',// скрыть через useFactory???
            database: 'newDBforBloggersPlatform',
            autoLoadEntities: true,
            synchronize: true,
          }
        }
      }),
    // TypeOrmModule.forFeature([User]),
    // MongooseModule.forRootAsync({
    //   useFactory: (configService: ConfigService<ConfigurationType, true>) => {
    //     const environmentSettings = configService.get('environmentSettings', {infer: true,});
    //     const databaseSettings = configService.get('databaseSettings', {infer: true,});
    //     const uri = environmentSettings.isTesting // для тестов
    //       ? databaseSettings.MONGO_CONNECTION_URI_FOR_TESTS
    //       : databaseSettings.MONGO_CONNECTION_URI;
    //     // console.log(uri);
    //     return {uri: uri};
    //   },
    //   inject: [ConfigService],
    // }),
    // // MongooseModule.forRoot(SETTINGS.MONGO_URL),
    // MongooseModule.forFeature([
    //   { name: User.name, schema: UserSchema },//-
    //   // { name: Comment.name, schema: CommentSchema },
    //   // { name: Blog.name, schema: BlogSchema },
    //   // { name: Post.name, schema: PostSchema },
    //   // { name: Session.name, schema: SessionSchema },//-
    //   // { name: ApiInfo.name, schema: ApiSchema },//-
    //   // { name: Like.name, schema: LikesSchema },
    // ]),
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
    ...modules
  ],
  controllers: [
    AppController,
    // CommentController,
    // BlogController,
    // PostController,
  ],
  providers: [
    // {
    //   provide: Types.IUserService,
    //   useClass: UserService
    // },
    AppService,
    LoginIsExistConstraint, EmailIsExistConstraint,/* BlogIsExistConstraint,*/
    // CommentService, CommentQueryRepository, CommentRepository,
    // BlogService, BlogRepository, BlogQueryRepository,
    // PostService, PostRepository, PostQueryRepository,
    ...useCases
  ]
})
export class AppModule {}