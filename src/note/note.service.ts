import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ghichu } from 'src/entites/ghichu.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(ghichu)
    private ghichuRepository: Repository<ghichu>,
  ) {}

  async create(body: CreateNoteDto) {
    const { MAADMIN, SDT, NOIDUNG, THOIGIAN, TRANGTHAI } = body;
    const condition: Partial<CreateNoteDto> = {};

    if (MAADMIN) {
      condition.MAADMIN = MAADMIN;
    }
    if (SDT) {
      condition.SDT = SDT;
    }
    if (NOIDUNG) {
      condition.NOIDUNG = NOIDUNG;
    }
    if (THOIGIAN) {
      condition.THOIGIAN = THOIGIAN;
    }
    if (TRANGTHAI) {
      condition.TRANGTHAI = TRANGTHAI;
    }

    const note = this.ghichuRepository.create(condition);

    await this.ghichuRepository.save(note, {
      reload: true,
    });

    return note;
  }

  async findAll(query: Partial<CreateNoteDto>) {
    const { MAADMIN, SDT, TRANGTHAI } = query;
    const condition: Partial<CreateNoteDto> = {};
    if (MAADMIN) {
      condition.MAADMIN = MAADMIN;
    }
    if (SDT) {
      condition.SDT = SDT;
    }
    if (TRANGTHAI) {
      condition.TRANGTHAI = TRANGTHAI;
    }

    return await this.ghichuRepository.find({ where: condition });
  }

  async update(body: UpdateNoteDto) {
    const { STT, NOIDUNG, THOIGIAN, TRANGTHAI } = body;

    // Tạo một đối tượng chứa các giá trị cần cập nhật
    const updateNote: Partial<CreateNoteDto> = {};

    if (NOIDUNG !== undefined) {
      updateNote.NOIDUNG = NOIDUNG;
    }
    if (THOIGIAN !== undefined) {
      updateNote.THOIGIAN = THOIGIAN;
    }
    if (TRANGTHAI !== undefined) {
      updateNote.TRANGTHAI = TRANGTHAI;
    }

    // Thực hiện cập nhật dữ liệu vào cơ sở dữ liệu
    const note = await this.ghichuRepository.findOne({
      where: {
        STT: STT,
      },
    });
    if (!note) {
      throw new Error('Không tìm thấy ghi chú để cập nhật');
    }

    return await this.ghichuRepository.update(
      {
        STT: STT,
      },
      updateNote,
    );
  }

  async remove(STT: number) {
    const note = await this.ghichuRepository.findOne({
      where: {
        STT: STT,
      },
    });
    if (!note) {
      throw new Error(`Không tìm thấy ghi chú có id ${STT} để xóa`);
    }

    return await this.ghichuRepository.remove(note);
  }
}
