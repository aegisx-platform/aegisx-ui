# Feature Development Commands

> **🚀 Quick commands สำหรับการจัดการ Feature Development**

## 📋 **Template Commands**

### 🎯 **Start New Feature**

```bash
# /feature-start [feature-name] [priority]
# Example: /feature-start password-change high

# 1. Create feature branch
git checkout -b feature/[feature-name]

# 2. Reserve resources (edit registry first!)
# Edit docs/features/RESOURCE_REGISTRY.md manually

# 3. Initialize feature documentation
mkdir docs/features/[feature-name]
cp docs/features/templates/* docs/features/[feature-name]/

# 4. Update feature name in templates
sed -i '' 's/\[Feature Name\]/[Feature Display Name]/g' docs/features/[feature-name]/*.md
sed -i '' 's/\[feature-name\]/[feature-name]/g' docs/features/[feature-name]/*.md

# 5. Initial commit
git add docs/features/[feature-name]/ docs/features/RESOURCE_REGISTRY.md
git commit -m "feat: initialize [feature-name] feature planning"
git push -u origin feature/[feature-name]

echo "✅ Feature '[feature-name]' initialized!"
echo "📝 Edit docs/features/[feature-name]/FEATURE.md to complete planning"
echo "📊 Update docs/features/README.md to add to active features"
```

### 📊 **Check Feature Status**

```bash
# /feature-status [feature-name]
# Example: /feature-status password-change

echo "📊 Feature Status: [feature-name]"
echo "=================================="
echo
echo "📁 Documentation:"
ls -la docs/features/[feature-name]/
echo
echo "📋 Progress Overview:"
grep -A 10 "Progress Overview" docs/features/[feature-name]/PROGRESS.md
echo
echo "🔄 Current Task:"
grep -A 5 "Current Task:" docs/features/[feature-name]/PROGRESS.md
echo
echo "⏳ Next Up:"
grep -A 10 "Next Up" docs/features/[feature-name]/PROGRESS.md
```

### 🔄 **Update Progress**

```bash
# /feature-progress [feature-name] "[task-description]" [percentage]
# Example: /feature-progress password-change "Completed API endpoints" 75

# Update timestamp
current_time=$(date '+%Y-%m-%d %H:%M')
sed -i '' "s/Last Updated.*/Last Updated**: $current_time/" docs/features/[feature-name]/PROGRESS.md

# Add session log entry
echo "
### $current_time - Session Update
- **Completed**: [task-description]
- **Progress**: [percentage]% complete
- **Status**: [status-note]
- **Next**: [next-task]" >> docs/features/[feature-name]/PROGRESS.md

echo "✅ Progress updated for '[feature-name]' to [percentage]%"
echo "📝 Edit docs/features/[feature-name]/PROGRESS.md to add details"
```

### 🚨 **Check Conflicts**

```bash
# /feature-conflicts [feature-name]
# Example: /feature-conflicts password-change

echo "🔍 Checking conflicts for: [feature-name]"
echo "========================================="
echo
echo "📊 Resource Registry Status:"
grep -A 20 "Database Resources" docs/features/RESOURCE_REGISTRY.md
echo
echo "🛣️ API Endpoint Conflicts:"
grep -r "\/api\/" apps/api/src/modules/ | grep -v ".git"
echo
echo "🎨 Frontend Route Conflicts:"
find apps/web/src/app -name "*.routes.ts" -exec grep -l "path:" {} \;
echo
echo "🧩 Shared Component Usage:"
find apps/web/src/app -name "*.component.ts" -exec grep -l "Service" {} \; | head -5
```

### ✅ **Complete Feature**

```bash
# /feature-complete [feature-name]
# Example: /feature-complete password-change

echo "🎯 Completing feature: [feature-name]"
echo "===================================="

# Check if all tasks are done
echo "📋 Pre-completion checklist:"
echo "- [ ] All tasks in TASKS.md completed?"
echo "- [ ] All tests passing (>90% coverage)?"
echo "- [ ] Documentation updated?"
echo "- [ ] No merge conflicts with develop?"
echo "- [ ] Ready for PR?"
echo
read -p "All items checked? (y/n): " ready

if [[ $ready == "y" ]]; then
    # Update feature status
    current_date=$(date '+%Y-%m-%d')

    # Move to completed in dashboard
    echo "📊 Update docs/features/README.md manually:"
    echo "- Move '[feature-name]' from Active to Completed"
    echo "- Set completion date: $current_date"

    # Release resources
    echo "🔓 Update docs/features/RESOURCE_REGISTRY.md manually:"
    echo "- Remove '[feature-name]' reservations"
    echo "- Mark resources as Available"

    # Create PR reminder
    echo "🚀 Next steps:"
    echo "1. Create Pull Request"
    echo "2. Request code review"
    echo "3. Update CHANGELOG.md"
    echo "4. Merge after approval"

else
    echo "❌ Feature not ready for completion"
fi
```

### 🏗️ **Feature Dashboard**

```bash
# /feature-dashboard
# Shows current status of all features

echo "📊 Feature Development Dashboard"
echo "================================"
echo "Last Updated: $(date '+%Y-%m-%d %H:%M')"
echo
echo "🚀 Active Features:"
grep -A 10 "Active Features" docs/features/README.md
echo
echo "🔥 Integration Alerts:"
grep -A 5 "Integration Alerts" docs/features/README.md
echo
echo "📈 Resource Utilization:"
grep -A 10 "Resource Utilization" docs/features/README.md
echo
echo "💡 Quick Actions:"
echo "- /feature-start [name] [priority] - Start new feature"
echo "- /feature-status [name] - Check feature progress"
echo "- /feature-conflicts [name] - Check for conflicts"
echo "- /feature-complete [name] - Mark feature complete"
```

### 🔧 **Feature Toolkit**

```bash
# /feature-toolkit
# Shows all available feature commands

echo "🛠️ Feature Development Toolkit"
echo "==============================="
echo
echo "📋 Available Commands:"
echo "- /feature-start [name] [priority]     - Initialize new feature"
echo "- /feature-status [name]               - Show feature status"
echo "- /feature-progress [name] [task] [%]  - Update progress"
echo "- /feature-conflicts [name]            - Check conflicts"
echo "- /feature-complete [name]             - Complete feature"
echo "- /feature-dashboard                   - Show all features"
echo "- /feature-toolkit                     - Show this help"
echo
echo "📚 Essential Files:"
echo "- docs/features/README.md              - Feature dashboard"
echo "- docs/features/RESOURCE_REGISTRY.md   - Resource coordination"
echo "- docs/features/templates/             - Feature templates"
echo "- docs/development/feature-development-standard.md - Standards"
echo
echo "📖 Documentation:"
echo "- Feature Development Standard: MANDATORY workflow"
echo "- Multi-Feature Workflow: Parallel development coordination"
echo "- Resource Registry: Conflict prevention system"
echo
echo "💡 Workflow:"
echo "1. /feature-start [name] [priority]"
echo "2. Edit docs/features/[name]/FEATURE.md (requirements)"
echo "3. Reserve resources in RESOURCE_REGISTRY.md"
echo "4. Follow 5-phase development standard"
echo "5. /feature-progress [name] [task] [%] (regular updates)"
echo "6. /feature-complete [name] (when ready for PR)"
```

---

## 🚀 **Quick Setup Script**

Create these as shell functions by adding to your `.bashrc` or `.zshrc`:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias feature-start="bash -c 'echo \"Use: /feature-start [name] [priority]\" && echo \"Example: /feature-start password-change high\"'"
alias feature-status="bash -c 'echo \"Use: /feature-status [name]\" && echo \"Example: /feature-status password-change\"'"
alias feature-dashboard="bash -c 'cat docs/features/README.md | head -50'"
alias feature-help="bash -c 'echo \"📖 See: docs/development/feature-commands.md for all commands\"'"
```

---

## 💡 **Usage Examples**

### Start Password Change Feature

```bash
/feature-start password-change high
# Creates branch, docs, templates, and initial commit
```

### Check Progress

```bash
/feature-status password-change
# Shows current status, progress, and next tasks
```

### Update Progress

```bash
/feature-progress password-change "Completed API endpoints" 75
# Updates progress to 75% with completion note
```

### Check Dashboard

```bash
/feature-dashboard
# Shows all active features, conflicts, and metrics
```

### Complete Feature

```bash
/feature-complete password-change
# Runs completion checklist and creates PR reminders
```

---

## 📚 **Integration with CLAUDE.md**

These commands work with the Feature Development Standard:

1. **Planning Phase** → Use `/feature-start`
2. **Development Phase** → Use `/feature-progress` regularly
3. **Integration Phase** → Use `/feature-conflicts` to check
4. **Completion Phase** → Use `/feature-complete`
5. **Monitoring** → Use `/feature-dashboard` for overview

All commands respect the MANDATORY standards and help maintain quality across parallel development! 🎯
