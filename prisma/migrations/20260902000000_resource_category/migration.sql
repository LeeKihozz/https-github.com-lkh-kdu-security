-- 자료 분류(카테고리) 및 묶음(그룹) 컬럼 추가
ALTER TABLE "Resource" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'ETC';
ALTER TABLE "Resource" ADD COLUMN "groupName" TEXT;
