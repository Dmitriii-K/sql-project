// import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';
// import { validate } from 'class-validator';
// import { plainToInstance } from 'class-transformer';
// import { BlogRepository } from 'src/features/blogs/repository/blog.repository';

// @Injectable()
// export class BlogExistsPipe implements PipeTransform {
//   constructor(
//     protected blogRepository: BlogRepository
//   ) {}
//   async transform(value: string, { metatype }: ArgumentMetadata) {
//     const foundBlog = await this.blogRepository.findBlogById(value)
//     if (!foundBlog) {
//       throw new NotFoundException('blog is not exists');
//     }
//     return value;
//   }
// }