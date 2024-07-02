import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Request, Response, query } from 'express';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post('create')
  async create(@Body() body: CreateNoteDto, @Res() res: Response) {
    try {
      const data = await this.noteService.create(body);
      return res.status(200).json({
        statusCode: 200,
        message: 'Tạo ghi chú thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Get('readAll')
  async findAll(@Query() query: Partial<CreateNoteDto>, @Res() res: Response) {
    try {
      const data = await this.noteService.findAll(query);
      return res.status(200).json({
        statusCode: 200,
        message: 'Đọc ghi chú thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Patch('update')
  async update(@Body() body: UpdateNoteDto, @Res() res: Response) {
    try {
      const data = await this.noteService.update(body);
      return res.status(200).json({
        statusCode: 200,
        message: 'Cập nhật ghi chú thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.',
      });
    }
  }

  @Delete(':id')
  async remove(@Param('id') STT: string, @Res() res: Response) {
    try {
      const data = await this.noteService.remove(+STT);
      return res.status(200).json({
        statusCode: 200,
        message: 'Xóa ghi chú thành công.',
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error?.message || 'Lỗi server.', 
      });
    }
  }
}
