# instructions
我要构建一个demo项目，功能是通过自然语言输入，使用LLM识别，生成数据库查询SQL，用户可以执行查询 查看 该SQL的结果。
服务端使用Python实现，前使用REACT JS,主题用tailwind。python服务端提供 API调用，LLM调用，生成SQL返回给前端，前端用户可以执行该SQL并用二维表的形式查看数据。服务端只接受查询的SQL语法，并向数据库执行查询，返回结果。
服务端可以让前端添加数据库链接字符串，并用本地sql lite保存用户添加的数据库链接。Day One暂时只支持PG 数据库的链接。
请按以上要求，梳理，分析并编写 开发需求 instruction,保存到 spec/instructions.md

# day one spec

## back-end
读取 spec/instructions.md ，识别DayOne的back-end功能，帮我设计一份开发分步开发清单，要严格按照开发规格说明中的后端功能文件夹和文件名进行规划。
保存到 spec/spec-back-end-day-one.dev.md

## front-end
读取 spec/instructions.md ，识别DayOne的front-end功能，帮我设计一份开发分步开发清单，要严格按照开发规格说明中的后端功能文件夹和文件名进行规划。
保存到 spec/spec-front-end-day-one.dev.md
