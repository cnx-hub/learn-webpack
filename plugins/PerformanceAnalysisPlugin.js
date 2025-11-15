// 自定义性能分析插件（兼容 Webpack 5，避免 speed-measure-webpack-plugin 的兼容性问题）
// 这个插件使用 Webpack 5 的 hooks API，不会包装 loader，因此完全兼容 CSS loader
class PerformanceAnalysisPlugin {
    constructor(options = {}) {
        this.options = {
            loaderTopFiles: options.loaderTopFiles || 10,
            ...options,
        };
        this.loaderStats = new Map();
        this.pluginStats = new Map();
        this.startTime = null;
    }

    apply(compiler) {
        this.startTime = Date.now();

        // 追踪 loader 使用情况
        compiler.hooks.compilation.tap("PerformanceAnalysisPlugin", (compilation) => {
            compilation.hooks.buildModule.tap("PerformanceAnalysisPlugin", (module) => {
                if (module.loaders && module.loaders.length > 0) {
                    // 提取 loader 名称
                    const loaderNames = module.loaders
                        .map((loader) => {
                            const name = loader.loader || loader;
                            if (typeof name === "string") {
                                // 提取 loader 名称（去掉路径，只保留文件名）
                                const parts = name.split(/[\\/]/);
                                return parts[parts.length - 1].replace(/\.js$/, "");
                            }
                            return "unknown";
                        })
                        .filter(Boolean)
                        .join(" → ");

                    if (!this.loaderStats.has(loaderNames)) {
                        this.loaderStats.set(loaderNames, {
                            count: 0,
                            modules: new Set(),
                        });
                    }

                    const stats = this.loaderStats.get(loaderNames);
                    stats.count++;
                    if (module.resource) {
                        stats.modules.add(module.resource);
                    } else if (module.identifier) {
                        stats.modules.add(module.identifier());
                    }
                }
            });
        });

        // 追踪插件
        compiler.hooks.compilation.tap("PerformanceAnalysisPlugin", (compilation) => {
            const plugins = compilation.options.plugins || [];
            plugins.forEach((plugin) => {
                const name = plugin.constructor.name;
                if (name && name !== "PerformanceAnalysisPlugin") {
                    if (!this.pluginStats.has(name)) {
                        this.pluginStats.set(name, true);
                    }
                }
            });
        });

        // 构建完成时输出分析结果
        compiler.hooks.done.tap("PerformanceAnalysisPlugin", (stats) => {
            const totalTime = (Date.now() - this.startTime) / 1000;
            const compilation = stats.compilation;

            console.log("\n📊 Performance Analysis");
            console.log("=".repeat(60));
            console.log(`⏱  Total build time: ${totalTime.toFixed(2)}s\n`);

            // 输出插件列表
            if (this.pluginStats.size > 0) {
                console.log("🔌 Plugins:");
                Array.from(this.pluginStats.keys()).forEach((name) => {
                    console.log(`   ✓ ${name}`);
                });
                console.log();
            }

            // 输出 loader 统计（按使用次数排序）
            if (this.loaderStats.size > 0) {
                console.log("⚙️  Loaders (top " + this.options.loaderTopFiles + "):");
                const sortedLoaders = Array.from(this.loaderStats.entries())
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(0, this.options.loaderTopFiles);

                sortedLoaders.forEach(([name, info], index) => {
                    const modules = Array.from(info.modules);
                    console.log(`   ${index + 1}. ${name}`);
                    console.log(`      └─ ${info.count} module(s)`);
                    if (modules.length > 0 && modules.length <= 3) {
                        modules.forEach((module) => {
                            const shortPath = module.split("/").slice(-2).join("/");
                            console.log(`         • ${shortPath}`);
                        });
                    } else if (modules.length > 3) {
                        const sample = modules.slice(0, 2);
                        sample.forEach((module) => {
                            const shortPath = module.split("/").slice(-2).join("/");
                            console.log(`         • ${shortPath}`);
                        });
                        console.log(`         • ... and ${modules.length - 2} more`);
                    }
                });
                console.log();
            }

            // 输出构建统计
            if (compilation) {
                console.log("📦 Build Stats:");
                console.log(`   • Modules: ${compilation.modules.size}`);
                console.log(`   • Chunks: ${compilation.chunks.size}`);
                console.log(`   • Assets: ${Object.keys(compilation.assets).length}`);
                if (compilation.errors && compilation.errors.length > 0) {
                    console.log(`   • Errors: ${compilation.errors.length}`);
                }
                if (compilation.warnings && compilation.warnings.length > 0) {
                    console.log(`   • Warnings: ${compilation.warnings.length}`);
                }
            }

            console.log("=".repeat(60) + "\n");
        });
    }
}

module.exports = PerformanceAnalysisPlugin;