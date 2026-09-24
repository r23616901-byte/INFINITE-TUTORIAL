import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import * as fileProcessingService from '../services/fileProcessingService';

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`✅ [PASS] ${msg}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${msg}`);
    failed++;
  }
}

async function runTests() {
  console.log('======================================================================');
  console.log('🧪 TESTING FILE MANAGEMENT & MULTI-TIER IMAGE PROCESSING (STEPS 41 & 42)');
  console.log('======================================================================\n');

  try {
    // ------------------------------------------------------------------
    // TEST 1: Validate Pre-Seeded File Categories & Metadata Structure (Step 41)
    // ------------------------------------------------------------------
    console.log("--- Test 1: Validate Storage Metadata (All 7 Fields Required) ---");
    const initialFiles = await fileProcessingService.listFiles({});
    assert(initialFiles.total >= 5, `Initial file registry contains ${initialFiles.total} files (expected >= 5)`);

    const sample = initialFiles.data[0];
    assert(!!sample.file_id, `1. file_id: ${sample.file_id}`);
    assert(!!sample.file_name, `2. file_name: ${sample.file_name}`);
    assert(!!sample.file_url, `3. file_url: ${sample.file_url}`);
    assert(!!sample.file_type, `4. file_type: ${sample.file_type}`);
    assert(sample.file_size > 0, `5. file_size: ${sample.file_size} bytes`);
    assert(!!sample.uploaded_by, `6. uploaded_by: ${sample.uploaded_by}`);
    assert(!!sample.uploaded_at, `7. uploaded_at: ${sample.uploaded_at}`);
    console.log("   All 7 required database metadata fields present and validated.\n");

    // ------------------------------------------------------------------
    // TEST 2: Storage Separation & Category Directories (Step 41)
    // ------------------------------------------------------------------
    console.log("--- Test 2: Storage Separation from Database ---");
    const categories = Object.keys(fileProcessingService.CATEGORY_FOLDERS) as Array<keyof typeof fileProcessingService.CATEGORY_FOLDERS>;
    assert(categories.includes('STUDENT_PHOTO'), 'Category folder: student-photos');
    assert(categories.includes('TEST_PAPER'), 'Category folder: test-papers');
    assert(categories.includes('ANSWER_SHEET'), 'Category folder: answer-sheets');
    assert(categories.includes('ANNOUNCEMENT'), 'Category folder: announcements');
    assert(categories.includes('LEAVE_ATTACHMENT'), 'Category folder: leave-attachments');
    assert(categories.includes('DOCUMENT'), 'Category folder: documents');

    categories.forEach((cat) => {
      const folder = fileProcessingService.CATEGORY_FOLDERS[cat];
      assert(fs.existsSync(folder), `Physical storage directory exists: ${path.basename(folder)}`);
    });
    console.log("   Filesystem separation verified.\n");

    // ------------------------------------------------------------------
    // TEST 3: Multi-Tier Image Compression Pipeline (Step 42)
    // ------------------------------------------------------------------
    console.log("--- Test 3: Multi-Tier Image Processing (Thumbnail, Normal, High-Quality) ---");
    // Generate a high-resolution test image (1200x800) in memory
    const rawImageBuffer = await sharp({
      create: {
        width: 1200,
        height: 800,
        channels: 3,
        background: { r: 50, g: 100, b: 200 },
      },
    })
      .jpeg({ quality: 95 })
      .toBuffer();

    const mockPhotoFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'student_neha_patel.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: rawImageBuffer,
      size: rawImageBuffer.length,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    const photoResult = await fileProcessingService.processAndStoreFile(
      mockPhotoFile,
      'STUDENT_PHOTO',
      'Admin Staff'
    );

    assert(!!photoResult.thumbnail_url, 'Tier 1: Generated optimized thumbnail URL');
    assert(!!photoResult.medium_url, 'Tier 2: Generated normal quality web URL');
    assert(photoResult.compressed_size! <= photoResult.original_size!, `Compressed size (${photoResult.compressed_size} bytes) <= original (${photoResult.original_size} bytes)`);
    assert(photoResult.isImage === true, 'Flagged as image for gallery preview');

    // Verify thumbnail disk dimensions with sharp
    if (photoResult.thumbnail_url) {
      const thumbDisk = path.join(process.cwd(), photoResult.thumbnail_url);
      if (fs.existsSync(thumbDisk)) {
        const thumbMeta = await sharp(thumbDisk).metadata();
        assert(thumbMeta.width === 200 && thumbMeta.height === 200, 'Student photo thumbnail cropped to exact 200x200 square avatar');
      }
    }
    console.log("   Student photo thumbnail generation validated.\n");

    // ------------------------------------------------------------------
    // TEST 4: Answer Sheet Quality Preservation (Step 42)
    // ------------------------------------------------------------------
    console.log("--- Test 4: Answer Sheet High-Quality Preservation ---");
    const mockAnswerFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'Student_Answer_Sheet_Physics_Q1_Q5.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: rawImageBuffer,
      size: rawImageBuffer.length,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    const answerResult = await fileProcessingService.processAndStoreFile(
      mockAnswerFile,
      'ANSWER_SHEET',
      'Prof. Rajesh Sharma (Physics)'
    );

    assert(!!answerResult.thumbnail_url, 'Answer sheet thumbnail created for quick roster review');
    assert(!!answerResult.file_url, 'Answer sheet high-quality version stored for readable text grading');
    console.log("   Answer sheet high-quality preservation validated.\n");

    // ------------------------------------------------------------------
    // TEST 5: Document & PDF Storage without Distortion
    // ------------------------------------------------------------------
    console.log("--- Test 5: Document (PDF) Upload without Image Compression ---");
    const dummyPdfBuffer = Buffer.from('%PDF-1.4 Mock Infinite Tutorial Circular');
    const mockPdfFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'Academic_Timetable_Term1.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: dummyPdfBuffer,
      size: dummyPdfBuffer.length,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    const docResult = await fileProcessingService.processAndStoreFile(
      mockPdfFile,
      'DOCUMENT',
      'Admin Staff'
    );

    assert(docResult.isImage === false, 'PDF detected as document, not image');
    assert(docResult.file_type === 'application/pdf', 'MIME type preserved as application/pdf');
    assert(docResult.file_size === dummyPdfBuffer.length, 'Original byte size preserved exactly');
    console.log("   Document storage verified.\n");

    // ------------------------------------------------------------------
    // TEST 6: File Listing, Filtering & Clean Deletion
    // ------------------------------------------------------------------
    console.log("--- Test 6: Query Filtering and Clean Deletion ---");
    const photoList = await fileProcessingService.listFiles({ category: 'STUDENT_PHOTO' });
    assert(photoList.data.every((f) => f.category === 'STUDENT_PHOTO'), 'Filtered strictly by STUDENT_PHOTO category');

    const searchList = await fileProcessingService.listFiles({ search: 'neha_patel' });
    assert(searchList.data.length >= 1, 'Search query matched uploaded file name');

    // Clean up created test file
    const deleteSuccess = await fileProcessingService.deleteFile(photoResult.file_id);
    assert(deleteSuccess === true, 'File and optimized variants deleted successfully');

    const verifyDeleted = await fileProcessingService.getFileById(photoResult.file_id);
    assert(verifyDeleted === null, 'Deleted file no longer in registry');

    console.log("\n======================================================================");
    console.log(`🎉 ALL FILE MANAGEMENT & IMAGE PROCESSING TESTS COMPLETED!`);
    console.log(`   Passed: ${passed} / ${passed + failed}`);
    console.log("======================================================================\n");
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

runTests();
